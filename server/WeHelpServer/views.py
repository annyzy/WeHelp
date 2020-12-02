import json
import requests
import os
import random
import sys
import traceback

import channels.layers

from asgiref.sync import async_to_sync

from django.utils import timezone
from django.core.exceptions import ObjectDoesNotExist
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt


from WeHelpServer.models import User, Message, Chat, Task


def signIn(body):
    # body: {'email', 'name', 'icon'}
    # return: {'UID', 'icon', 'coins', 'rating', 'num_rating', 'publish_count', 'finish_count', 'contributions': ['%Y-%m-%d']}
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

        publish_count = user.publish_task.all().count()
        finish_count = user.accept_task.all().filter(active=False).count()
        related_tasks = user.accept_task.all() | user.publish_task.all()

        contributions = []
        for task in related_tasks:
            contributions.append(task.datetime.strftime("%Y-%m-%d"))

    except ObjectDoesNotExist:
        user = User(coins=10, rating=0,
                    create_date=timezone.now(), email=email,
                    icon=icon, name=body['name'],
                    last_freecoin=timezone.now()
                    )
        user.save()
    res = {'UID': user.id, 'coins': user.coins,
           'icon': user.icon, 'rating': user.rating,
           'num_rating': user.num_rating,
           'publish_count': publish_count,
           'finish_count': finish_count,
           'contributions': contributions
           }
    return JsonResponse(res)


def getUser(body):
    #body: {'UID'}

    try:
        user = User.objects.get(id=body['UID'])
        publish_count = user.publish_task.all().count()
        finish_count = user.accept_task.all().filter(active=False).count()
        related_tasks = user.accept_task.all() | user.publish_task.all()

        contributions = []
        for task in related_tasks:
            contributions.append(task.datetime.strftime("%Y-%m-%d"))

        res = {'avatar': user.icon, 'coins': user.coins,
               'rating': user.rating, 'name': user.name,
               'num_rating': user.num_rating,
               'publish_count': publish_count,
               'finish_count': finish_count,
               'contributions': contributions
               }
    except ObjectDoesNotExist:
        res = {'success': 0}

    return JsonResponse(res)


def sendLocation(body):
    # body: {'senderUID', 'receiverUID', 'longtitude', 'latitude'}

    try:
        sender = User.objects.get(id=body['senderUID'])
        receiver = User.objects.get(id=body['receiverUID'])
        longtitude = body['longtitude']
        latitude = body['latitude']

        # send it to receiver client
        channel_layer = channels.layers.get_channel_layer()
        event = {
            'type': 'chat.location',
            'UID': sender.id,
            'datetime': timezone.now().strftime("%Y-%m-%d %H:%M:%S"),
            'longtitude': longtitude,
            'latitude': latitude
        }
        async_to_sync(channel_layer.group_send)(str(receiver.id), event)

        res = {'success': 1}

    except Exception as e:
        print(traceback.print_exc())
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


def getActiveTask(body):
    # body: {}
    # return: {'success': 1/0,
    #           taskList: [{
    #                       taskID,
    #                       UID,
    #                       acceptorUID,
    #                       title,
    #                       body,
    #                       cost,
    #                       datetime,
    #                       images: []
    #                     }]
    #         }

    try:
        tasks = Task.objects.filter(active=True)

        taskList = []
        for task in tasks:
            try:
                acceptorUID = task.acceptor.id
            except:
                acceptorUID = -1

            images = task.images.split(',')

            taskList.append({
                'taskID': task.id,
                'UID': task.user.id,
                'acceptorUID': acceptorUID,
                'title': task.title,
                'body': task.body,
                'cost': task.cost,
                'datetime': task.datetime.strftime("%Y-%m-%d %H:%M:%S"),
                'images': images
            })

        res = {'success': 1, 'taskList': taskList}

    except Exception as e:
        print(traceback.print_exc())
        res = {'success': 0}

    return JsonResponse(res)


def getPublishTask(body):
    # body: {'UID'}
    # return: {'success': 1/0,
    #           taskList: [{
    #                       taskID,
    #                       UID,
    #                       acceptorUID,
    #                       title,
    #                       body,
    #                       cost,
    #                       datetime,
    #                       images: []
    #                     }]
    #         }

    try:
        user = User.objects.get(id=body['UID'])
        tasks = user.publish_task.all().filter(active=True)

        taskList = []
        for task in tasks:
            try:
                acceptorUID = task.acceptor.id
            except:
                acceptorUID = -1

            images = task.images.split(',')

            taskList.append({
                'taskID': task.id,
                'UID': task.user.id,
                'acceptorUID': acceptorUID,
                'title': task.title,
                'body': task.body,
                'cost': task.cost,
                'datetime': task.datetime.strftime("%Y-%m-%d %H:%M:%S"),
                'images': images
            })

        res = {'success': 1, 'taskList': taskList}

    except Exception as e:
        print(traceback.print_exc())
        res = {'success': 0}

    return JsonResponse(res)


def getAcceptTask(body):
    # body: {'UID'}
    # return: {'success': 1/0,
    #           taskList: [{
    #                       taskID,
    #                       UID,
    #                       acceptorUID,
    #                       title,
    #                       body,
    #                       cost,
    #                       datetime,
    #                       images: []
    #                     }]
    #         }

    try:
        user = User.objects.get(id=body['UID'])
        tasks = user.accept_task.all().filter(active=True)

        taskList = []
        for task in tasks:
            try:
                acceptorUID = task.acceptor.id
            except:
                acceptorUID = -1

            images = task.images.split(',')

            taskList.append({
                'taskID': task.id,
                'UID': task.user.id,
                'acceptorUID': acceptorUID,
                'title': task.title,
                'body': task.body,
                'cost': task.cost,
                'datetime': task.datetime.strftime("%Y-%m-%d %H:%M:%S"),
                'images': images
            })

        res = {'success': 1, 'taskList': taskList}

    except Exception as e:
        print(traceback.print_exc())
        res = {'success': 0}

    return JsonResponse(res)


def acceptTask(body):
    # body: {'UID', 'taskID'}
    # return: {'success': 1/0}

    try:
        user = User.objects.get(id=body['UID'])
        task = Task.objects.get(id=body['taskID'])

        # check if task is accepted
        try:
            acceptor = task.acceptor
            res = {'success': 0}

        # if not, check uid
        except:
            if (user.id != task.user.id):
                task.acceptor = user
                task.save()
                res = {'success': 1}
            else:
                res = {'success': 0}

    except Exception as e:
        print(traceback.print_exc())
        res = {'success': 0}

    return JsonResponse(res)


def cancelAccept(body):
    # body: {'UID', 'taskID'}
    # return: {'success': 1/0}

    try:
        user = User.objects.get(id=body['UID'])
        task = Task.objects.get(id=body['taskID'])

        if (user.id == task.acceptor.id):
            task.acceptor = None
            task.save()
            res = {'success': 1}
        else:
            res = {'success': 0}

    except Exception as e:
        print(traceback.print_exc())
        res = {'success': 0}

    return JsonResponse(res)


def deleteTask(body):
    # body: {'UID', 'taskID'}
    # return: {'success': 1/0}

    try:
        user = User.objects.get(id=body['UID'])
        task = Task.objects.get(id=body['taskID'])

        if ((user.id == task.user.id) & task.active):
            task.delete()
            user.coins = user.coins + task.cost
            user.save()
            res = {'success': 1}
        else:
            res = {'success': 0}

    except Exception as e:
        print(traceback.print_exc())
        res = {'success': 0}

    return JsonResponse(res)


def finishTask(body):
    # body: {'UID', 'taskID', 'rating'}
    # return: {'success': 1/0}
    print("finishiTask")
    try:
        user = User.objects.get(id=body['UID'])
        task = Task.objects.get(id=body['taskID'])

        if ((user.id == task.user.id) & task.active):
            acceptor = task.acceptor
            acceptor.rating = acceptor.rating + body['rating']
            acceptor.num_rating = acceptor.num_rating + 1
            acceptor.coins = acceptor.coins + task.cost

            task.active = False
            task.save()
            acceptor.save()

            res = {'success': 1}

        else:
            res = {'success': 0}

    except Exception as e:
        print(traceback.print_exc())
        res = {'success': 0}

    return JsonResponse(res)


def upload(request):
    if (request.POST['func'] == 'changeIcon'):
        # avoid "return none" error, need to change it later
        return changeIcon(request)

    elif (request.POST['func'] == 'sendTask'):
        return sendTask(request)

    return changeIcon(request)


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


def sendTask(request):
    # body = {
    #    'title':
    #    'body':
    #    'cost':
    #    'image_count':
    #    'UID':
    # }

    # images are request.FILES['image_index']
    try:
        title = request.POST['title']
        body = request.POST['body']
        cost = request.POST['cost']
        image_count = request.POST['image_count']
        UID = request.POST['UID']
        user = User.objects.get(id=UID)

        task = Task(user=None, title=title, body=body,
                    datetime=timezone.now(), active=False,
                    acceptor=None, images='',
                    cost=int(cost))

        task.save()

        task.user = user
        task.active = True
        images = []
        # handle images:
        for i in range(int(image_count)):
            suffix = str(request.FILES[str(i)]).split('.')[-1]
            path = 'media/Task/{}/{}-{:x}.{}'.format(task.id,
                                                     timezone.now().strftime("%Y%m%d"), random.getrandbits(128), suffix)
            # write image to disk
            if (not os.path.exists(os.path.dirname(path))):
                os.makedirs(os.path.dirname(path))
            with open(path, 'wb+') as destination:
                for chunk in request.FILES[str(i)]:
                    destination.write(chunk)
            images.append(path)

        task.images = ','.join(images)
        user.coins = user.coins - int(cost)

        user.save()
        task.save()

        res = {'success': 1, 'taskID': task.id}

    except Exception as e:
        print(traceback.print_exc())
        res = {'success': 0}

    return JsonResponse(res, safe=False)


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

        elif (body['func'] == 'getUser'):
            return getUser(body)

        elif (body['func'] == 'getActiveTask'):
            return getActiveTask(body)

        elif (body['func'] == 'getPublishTask'):
            return getPublishTask(body)

        elif (body['func'] == 'getAcceptTask'):
            return getAcceptTask(body)

        elif (body['func'] == 'acceptTask'):
            return acceptTask(body)

        elif (body['func'] == 'cancelAccept'):
            return cancelAccept(body)

        elif (body['func'] == 'deleteTask'):
            return deleteTask(body)

        elif (body['func'] == 'finishTask'):
            return finishTask(body)

        elif (body['func'] == 'sendLocation'):
            return sendLocation(body)
    # avoid "return none" error
    return JsonResponse({'success': 0, 'comment': 'func incorrect'})
