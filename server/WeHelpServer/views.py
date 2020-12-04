"""
We only provide one endpoint for http requests: /WeHelp/
We differ the requests base on the provided 'func' key in json body for regular POST requests or in POST for form-data
These are possible 'func' values:
1. signIn - User sign in to server using email 
2. getUser - return infomation of an existing User
3. sendLocation - send location to other user
4. sendMessage - send message to other user 
5. getChatList - returns all chat infomation belong to a User 
6. getMessage - returns all messages of a chat 
7. getActiveTask - returns infomation of all Task that is open 
8. getAcceptTask - returns infomation of all Task that is accpeted by given User 
9. getPublishTask - returns infomation of all Task that is published by given User 
10. acceptTask - User accpet a Task
11. cancelAccept - User cancel accpetion of a Task
12. deleteTask - User delete a Task 
13. finishTask - User confirm a Task is finished
14. sendRating - give rating to User
15. changeIcon - User change icon/avatar. form-data POST request 
16. sendTask - User publish a task. form-data POST request
"""
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

# === signIn ===


def signIn(body):
    """
    User sign in to server using email

    Parameters
    ----------
    body: {'email': string, 'name': string, 'icon': string}

    Returns
    -------
    JsonResponse({
        'UID': int, 'coins': int,
        'icon': string, 'rating': int,
        'publish_count': int, 'finish_count': int,
        'contributions': [string*]
        })
    """
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
        publish_count = 0
        finish_count = 0
        contributions = []
        user.save()

    if (user.num_rating == 0):
        rating = 0
    else:
        rating = user.rating / user.num_rating
    res = {'UID': user.id, 'coins': user.coins,
           'icon': user.icon, 'rating': rating,
           'publish_count': publish_count,
           'finish_count': finish_count,
           'contributions': contributions
           }
    return JsonResponse(res)


# === getUser ===
def getUser(body):
    """
    return infomation of an existing User

    Parameters
    ----------
    body: {'UID': int}

    Returns
    -------
    JsonResponse({
        'UID': int, 'coins': int,
        'icon': string, 'rating': int,
        'publish_count': int, 
        'finish_count': int,
        'contributions': [string*],
        'success': int
        })
    """

    try:
        user = User.objects.get(id=body['UID'])
        publish_count = user.publish_task.all().count()
        finish_count = user.accept_task.all().filter(active=False).count()
        related_tasks = user.accept_task.all() | user.publish_task.all()

        contributions = []
        for task in related_tasks:
            contributions.append(task.datetime.strftime("%Y-%m-%d"))

        if (user.num_rating == 0):
            rating = 0
        else:
            rating = user.rating / user.num_rating
        res = {'avatar': user.icon, 'coins': user.coins,
               'rating': rating, 'name': user.name,
               'publish_count': publish_count,
               'finish_count': finish_count,
               'contributions': contributions,
               'success': 1
               }
    except ObjectDoesNotExist:
        res = {'success': 0}

    return JsonResponse(res)


# === sendLocation ===
def sendLocation(body):
    """
    send location to other user through channel_layer

    Parameters
    ----------
    body: {'senderUID': int, 'receiverUID': int, 
           'longitude': double, 'latitude': double}

    Returns
    -------
    JsonResponse({'success': int})
    """

    try:
        sender = User.objects.get(id=body['senderUID'])
        receiver = User.objects.get(id=body['receiverUID'])
        longitude = body['longitude']
        latitude = body['latitude']

        # send it to receiver client
        channel_layer = channels.layers.get_channel_layer()
        event = {
            'type': 'chat.location',
            'UID': sender.id,
            'datetime': timezone.now().strftime("%Y-%m-%d %H:%M:%S"),
            'longitude': longitude,
            'latitude': latitude
        }
        async_to_sync(channel_layer.group_send)(str(receiver.id), event)

        res = {'success': 1}

    except Exception as e:
        print(traceback.print_exc())
        res = {'success': 0}

    return JsonResponse(res)


# === sendMessage ===
def sendMessage(body):
    """
    send message to other user. 
    Stores the message into chat and send to receiver client through channel_layer

    Parameters
    ----------
    body: {'senderUID': int, 'receiverUID': int, 'message': string}

    Returns
    -------
    JsonResponse({'success': int})
    """

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
            chat = Chat(a=sender, b=receiver, last_message=None)

            chat.save()

        # construct the message
        message = Message(sender=sender, message=message_s,
                          date=timezone.now(), chat=chat)
        message.save()

        chat.last_message = message
        chat.save()

        # send update to receiver
        # a lazy way to avoid send update to receiver client when testing without redis server
        if not 'test' in sys.argv:
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


# === getChatList ===
def getChatList(body):
    """
    returns all chat infomation belong to a User.

    Parameters
    ----------
    body: {'UID': int}

    Returns
    -------
    JsonResponse({
        'success': int, 
        'chatList': [{ 
            'chatID': int, 'avatarURL': string, 
            'name': string, 'last_message': string, 
            'datetime': string 
        }] 
    })
    """

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


# === getMessage ===
def getMessage(body):
    """
    returns all messages inside a chat

    Parameters
    ----------
    body: {'chatID': int}

    Returns
    -------
    JsonResponse({
        'success': int, 
        'messageList': [{ 
            'UID': int, 'message': string, 
            'datetime': string 
        }] 
    })
    """
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


# === getActiveTask ===
def getActiveTask(body):
    """
    returns infomation of all Task that is open

    Parameters
    ----------
    body: {}

    Returns
    -------
    JsonResponse({
        'success': int, 
        'taskList': [{ 
            'taskID': int, 'UID': int, 
            'acceptorUID: int, 'title': string,
            'body': string, 'cost': int,
            'datetime': string, 'images': [string*]
        }] 
    })
    """

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


# === getPublishTask ===
def getPublishTask(body):
    """
    returns infomation of all Task that is published by the given User

    Parameters
    ----------
    body: {'UID': int}

    Returns
    -------
    JsonResponse({
        'success': int, 
        'taskList': [{ 
            'taskID': int, 'UID': int, 
            'acceptorUID: int, 'title': string,
            'body': string, 'cost': int,
            'datetime': string, 'images': [string*]
        }] 
    })
    """
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


# === getAcceptTask ===
def getAcceptTask(body):
    """
    returns infomation of all Task that is accepted by the given User

    Parameters
    ----------
    body: {'UID': int}

    Returns
    -------
    JsonResponse({
        'success': int, 
        'taskList': [{ 
            'taskID': int, 'UID': int, 
            'acceptorUID: int, 'title': string,
            'body': string, 'cost': int,
            'datetime': string, 'images': [string*]
        }] 
    })
    """

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


# === acceptTask ===
def acceptTask(body):
    """
    Allow users accept tasks only if they are not the publisher and the task is not accepted by someone else

    Parameters
    ----------
    body: {'UID': int, 'taskID': int}

    Returns
    -------
    JsonResponse({
        'success': int, 
    })
    """

    try:
        user = User.objects.get(id=body['UID'])
        task = Task.objects.get(id=body['taskID'])

        # check if task is accepted
        if ((task.acceptor == None) & (user.id != task.user.id)):
            task.acceptor = user
            task.save()
            res = {'success': 1}
        else:
            res = {'success': 0}

    except Exception as e:
        print(traceback.print_exc())
        res = {'success': 0}

    return JsonResponse(res)


# === cancelTask ===
def cancelAccept(body):
    """
    Allow users to give up acception of tasks only if they accpeted the tasks

    Parameters
    ----------
    body: {'UID': int, 'taskID': int}

    Returns
    -------
    JsonResponse({
        'success': int, 
    })
    """

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


# === deleteTask ===
def deleteTask(body):
    """
    Allow users to remove tasks only if they are the publisher of tasks and tasks are not yet finished.

    Parameters
    ----------
    body: {'UID': int, 'taskID': int}

    Returns
    -------
    JsonResponse({
        'success': int, 
    })
    """

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


# === finishTask ===
def finishTask(body):
    """
    Allow users to confirm tasks are finish only if they are the publisher of tasks and tasks are accepted by someone.

    Parameters
    ----------
    body: {'UID': int, 'taskID': int}

    Returns
    -------
    JsonResponse({
        'success': int, 
    })
    """
    try:
        user = User.objects.get(id=body['UID'])
        task = Task.objects.get(id=body['taskID'])

        if ((user.id == task.user.id) & task.active):
            acceptor = task.acceptor
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


# === sendRating ===
def sendRating(body):
    """
    give rating to a User.

    Parameters
    ----------
    body: {'UID': int, 'rating': double}

    Returns
    -------
    JsonResponse({
        'success': int, 
    })
    """

    try:
        user = User.objects.get(id=body['UID'])

        user.rating = user.rating + body['rating']
        user.num_rating = user.num_rating + 1
        user.save()

        res = {'success': 1}

    except Exception as e:
        print(traceback.print_exc())
        res = {'success': 0}

    return JsonResponse(res)


# === upload ===
def upload(request):
    """
    interface to handle requests that are 'multipart/form-data' content type.

    Parameters
    ----------
    request: HttpRequests object

    Returns
    -------
    JsonResponse
    """
    if (request.POST['func'] == 'changeIcon'):
        # avoid "return none" error, need to change it later
        return changeIcon(request)

    elif (request.POST['func'] == 'sendTask'):
        return sendTask(request)

    return changeIcon(request)


# === changeIcon ===
def changeIcon(request):
    """
    Allow Users to change their icons/avatars and returns the uri of stored image

    Parameters
    ----------
    request: HttpRequests 
             whose POST contains {'UID': int}
             and FILES contains {'file': a image file stream}

    Returns
    -------
    JsonResponse({'success': int, 'uri': string})
    """
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


# === sendTask ===
def sendTask(request):
    """
    Allow Users to publish task

    Parameters
    ----------
    request: HttpRequests 
             whose POST contains {'UID': int, 'body': string, 'title': string, 'cost': int, 'image_count': int}
             and FILES contains number of files depends on image_count: {'0': image file stream, '1': image file stream, ...}

    Returns
    -------
    JsonResponse({'success': int})
    """
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
# === index ===
def index(request):
    """
    A top level function to determine what kind of request is making base on the 'func' key

    Parameters
    ----------
    request: HttpRequests 

    Returns
    -------
    JsonResponse({})
    """

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

        elif (body['func'] == 'sendRating'):
            return sendRating(body)

    # avoid "return none" error
    return JsonResponse({'success': 0, 'comment': 'func incorrect'})
