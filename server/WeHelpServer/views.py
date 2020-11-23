import json
import requests
import os
import random
import sys
import traceback

from django.shortcuts import render
from django.utils import timezone
from django.core.exceptions import ObjectDoesNotExist
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

from WeHelpServer.models import User
from WeHelpServer.models import Message
from WeHelpServer.models import Chat


def signIn(body):
    try:
        email = body['email']
        icon = body['icon']
        user = User.objects.get(email=email)
    except ObjectDoesNotExist:
        user = User(coins=10, rating=0,
                    create_date=timezone.now(), email=email,
                    icon=icon, name=body['name'])
        user.save()
    res = {'UID': user.id, 'coins': user.coins,
           'icon': user.icon, 'rating': user.rating}
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

        # construct the message
        message = Message(sender=sender, message=message_s,
                          date=timezone.now())
        message.save()

        # add message to chat
        if (chat.message_list):
            new_message_list = chat.message_list.split(
                ',')
            new_message_list.append(str(message.id))
            new_message_list = ','.join(new_message_list)
        else:
            new_message_list = str(message.id)

        chat.message_list = new_message_list
        chat.last_message = message

        # save and response
        # TODO: send update to receiver via WebSocket
        chat.save()
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
            if (user == chat.a):
                user2 = chat.b
            else:
                user2 = chat.a
            avatarURL = user2.icon
            name = user2.name
            last_message = chat.last_message.message
            datetime = chat.last_message.date.strftime("%Y-%m-%d %H:%M:%S")
            chat_info_list.append(
                {'chatID': chatID, 'avatarURL': avatarURL,
                 'name': name, 'last_message': last_message,
                 'datetime': datetime})

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
        message_list = chat.message_list.split(',')
        messages = []
        for m in message_list:
            messages.append(Message.objects.get(id=int(m)))

        messageList = []
        for m in messages:
            messageList.append(
                {'UID': m.sender.id, 'message': m.message, 'datetime': m.date})

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

    # avoid "return none" error, need to change it later
    return signIn(body)
