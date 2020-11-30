import json
import requests
import os
import random
import sys
import traceback

import channels.layers

from asgiref.sync import async_to_sync

from django.shortcuts import render
from django.utils import timezone
from django.core.exceptions import ObjectDoesNotExist
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

from django.core.files.uploadedfile import SimpleUploadedFile
from django.core.exceptions import ValidationError


from WeHelpServer.models import User
from WeHelpServer.models import Message
from WeHelpServer.models import Chat
from WeHelpServer.models import Post, Images
from WeHelpServer.form import PostForm, ImageForm

from django.forms import modelformset_factory

from django.http import HttpResponseRedirect



def signIn(body):
    try:
        email = body['email']
        icon = body['icon']
        user = User.objects.get(email=email)
        now = timezone.now()

        # get one coin if login after 4 hours
        if ((now - user.last_freecoin).seconds > 3600 * 4):
            user.coins = user.coins + 1
            user.last_freecoin = now
            user.save()

    except ObjectDoesNotExist:
        user = User(coins=10, rating=0,
                    create_date=timezone.now(), email=email,
                    icon=icon, name=body['name'],
                    last_freecoin=timezone.now()
                    )
        user.save()
    res = {'UID': user.id, 'coins': user.coins,
           'icon': user.icon, 'rating': user.rating,
           'num_rating': user.num_rating}
    return JsonResponse(res)


def getUser(body):
    #body: {'UID'}

    try:
        user = User.objects.get(id=body['UID'])

        res = {'avatar': user.icon, 'coins': user.coins,
               'rating': user.rating, 'name': user.name,
               'num_rating': user.num_rating}
    except ObjectDoesNotExist:
        res = {'success': 0}

    return JsonResponse(res)


def sendMessage(body):
    # body: {'message', 'senderUID', 'receiverUID'}

    try:
        message_s = body['message']
        sender = User.objects.get(id=body['senderUID'])
        receiver = User.objects.get(id=body['receiverUID'])

        # find the chat for these two user or create one
        if (Chat.objects.filter(a=sender, b=receiver)):
            chat = Chat.objects.get(a=sender, b=receiver)

        elif (Chat.objects.filter(a=receiver, b=sender)):
            chat = Chat.objects.get(a=receiver, b=sender)

        else:
            chat = Chat(a=sender, b=receiver)
            chat.save()

        # construct the message
        message = Message(sender=sender, message=message_s,
                          date=timezone.now(), chat=chat)
        message.save()

        chat.last_message = message
        chat.save()

        # send update to receiver
        channel_layer = channels.layers.get_channel_layer()
        event = {
            'type': 'chat.message',
            'chatID': chat.id,
            'avatar': sender.icon,
            'name': sender.name,
            'UID': sender.id,
            'datetime': message.date.strftime("%Y-%m-%d %H:%M:%S"),
            'message': message.message
        }
        async_to_sync(channel_layer.group_send)(str(receiver.id), event)

        res = {'success': 1}

    except ObjectDoesNotExist:
        print(traceback.print_exc())
        res = {'success': 0}
    except KeyError:
        print(traceback.print_exc())
        res = {'success': 0}
    except Exception as e:
        print(traceback.print_exc())
        res = {'success': 0}

    return JsonResponse(res)


def getChatList(body):
    # body: {'UID'}
    # return: {'success': 1/0, 'chatList': [{chatID, avatarURL, name, last_message, datetime}*]}

    try:
        user = User.objects.get(id=body['UID'])
        chats = user.user_chat_a.all() | user.user_chat_b.all()
        chats = chats.order_by('-last_message')

        chat_info_list = []
        for chat in chats:
            chatID = chat.id
            try:
                if (user == chat.a):
                    user2 = chat.b
                else:
                    user2 = chat.a
                avatarURL = user2.icon
                name = user2.name
                UID = user2.id
                last_message = chat.last_message.message
                datetime = chat.last_message.date.strftime("%Y-%m-%d %H:%M:%S")
                chat_info_list.append(
                    {'chatID': chatID, 'avatarURL': avatarURL,
                     'name': name, 'last_message': last_message,
                     'datetime': datetime, 'UID': UID})
            except:  # avoid deleted users
                continue

        res = {'success': 1, 'chatList': chat_info_list}

    except ObjectDoesNotExist:
        print(traceback.print_exc())
        res = {'success': 0}

    return JsonResponse(res, safe=False)


def getMessage(body):
    # body: {'chatID'}
    # return: {'success': 1/0, 'messageList': [{UID, message, datetime}]}
    try:
        chat = Chat.objects.get(id=body['chatID'])
        messages = chat.chat_message.all()

        messageList = []
        for m in messages:
            messageList.append(
                {'UID': m.sender.id, 'message': m.message, 'datetime': m.date.strftime("%Y-%m-%d %H:%M:%S")})

        res = {'success': 1, 'messageList': messageList}

    except ObjectDoesNotExist:
        print(traceback.print_exc())
        res = {'success': 0}

    return JsonResponse(res, safe=False)


def changeIcon(request):
    try:
        suffix = str(request.FILES['file']).split('.')[-1]
        UID = request.POST['UID']
        path = 'media/User/{}/{}-{:x}.{}'.format(UID,
                                                 timezone.now().strftime("%Y%m%d"), random.getrandbits(128), suffix)
        if (not os.path.exists(os.path.dirname(path))):
            os.makedirs(os.path.dirname(path))
        with open(path, 'wb+') as destination:
            for chunk in request.FILES['file']:
                destination.write(chunk)

        user = User.objects.get(id=UID)
        user.icon = path
        user.save()
        res = {'success': 1, 'uri': path}
    except Exception as e:
        print(traceback.print_exc())
        res = {'success': 0}
    return JsonResponse(res)


def upload(request):
    if (request.POST['func'] == 'changeIcon'):
        # avoid "return none" error, need to change it later
        return changeIcon(request)
    return changeIcon(request)

def sendPost(request):
    ImageFormSet = modelformset_factory(Images, form=ImageForm, extra=4)
    ifsubmit = False
    if request.method == 'POST':
        postForm = PostForm(request.POST, request.FILES)
        formset = ImageFormSet(request.POST, request.FILES, queryset=Images.objects.none())
        if postForm.isValid() and formset.isValid():
            #do something
            # cd = form.cleaned_data
            post_form = postForm.save(commit=False)
            post_form.user = request.user
            post_form.save()

            for form in formset.cleaned_data:
                # prevent crashes from not uploading all photos
                if form:
                    image = form['image']
                    photo = Images(post=post_form, image=image)
                    photo.save()

            return HttpResponseRedirect("/")
        else:
            print(postForm.errors, formset.errors)
    else:
        postForm = PostForm()
        formset = ImageFormSet(queryset=Images.objects.none())
    return render(request, 'PageNavigation.js', {'postForm': postForm, 'formset': formset})


@csrf_exempt
def index(request):
    if (request.content_type == 'multipart/form-data'):
        return upload(request)
    else:
        body = json.loads(request.body)
        if (body['func'] == 'signIn'):
            return signIn(body)

        elif (body['func'] == 'sendMessage'):
            return sendMessage(body)

        elif (body['func'] == 'getChatList'):
            return getChatList(body)

        elif (body['func'] == 'getMessage'):
            return getMessage(body)
        elif (body['func'] == 'sendPost'):
            return sendPost(body)

        elif (body['func'] == 'getUser'):
            return getUser(body)

    # avoid "return none" error, need to change it later
    return signIn(body)
