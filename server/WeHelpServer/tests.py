import json
import ast
import os
import filecmp
import websocket
import asyncio
import requests
from django.test import TestCase
from unittest import skipIf, skip
from django.http import JsonResponse
from django.http import HttpRequest

from WeHelpServer.models import *
from WeHelpServer.views import *
# Create your tests here.

# helper function:
# get a dict content from JsonResponse object


def get_dict(res):
    return ast.literal_eval(res.content.decode("UTF-8"))


class SignInTestCase(TestCase):
    def setUp(self):
        # fake google account infomation for Alice and Bob
        self.Alice_ga = {
            'email': 'alice@gmail.com',
            'name': 'Alice',
            'icon': 'bad_icon.jpg'
        }
        self.Bob_ga = {
            'email': 'bob@gmail.com',
            'name': 'Bob',
            'icon': 'bad_icon.jpg'
        }

        self.Alice_signin = get_dict(signIn(self.Alice_ga))
        self.Bob_signin = get_dict(signIn(self.Bob_ga))
        self.Alice = User.objects.get(id=self.Alice_signin['UID'])
        self.Bob = User.objects.get(id=self.Bob_signin['UID'])

    def test_signIn_correctness(self):
        self.assertSetEqual({key for key in self.Alice_signin.keys()}, {
            'UID', 'coins', 'rating', 'publish_count', 'finish_count', 'contributions', 'icon'})
        self.assertEqual(self.Alice.email, self.Alice_ga['email'])
        self.assertEqual(self.Alice.name, self.Alice_ga['name'])
        self.assertLess(0, self.Alice.id)

        self.assertSetEqual({key for key in self.Bob_signin.keys()}, {
            'UID', 'coins', 'rating', 'publish_count', 'finish_count', 'contributions', 'icon'})
        self.assertEqual(self.Bob.email, self.Bob_ga['email'])
        self.assertEqual(self.Bob.name, self.Bob_ga['name'])
        self.assertLess(0, self.Bob.id)

    # test only one user can be created in multiple signIn with the same email and name

    def test_signIn_unique_user(self):
        Alice_signin_1 = ast.literal_eval(
            signIn(self.Alice_ga).content.decode("UTF-8"))
        Alice_signin_2 = ast.literal_eval(
            signIn(self.Alice_ga).content.decode("UTF-8"))

        count = User.objects.filter(id=Alice_signin_1['UID']).count()

        self.assertEqual(Alice_signin_1['UID'], Alice_signin_2['UID'])
        self.assertEqual(Alice_signin_1['UID'], self.Alice.id)
        self.assertEqual(count, 1)


class MessageTestCase(TestCase):

    def setUp(self):
        # fake google account infomation for Alice and Bob
        self.Alice_ga = {
            'email': 'alice@gmail.com',
            'name': 'Alice',
            'icon': 'bad_icon.jpg'
        }
        self.Bob_ga = {
            'email': 'bob@gmail.com',
            'name': 'Bob',
            'icon': 'bad_icon.jpg'
        }

        self.Alice_signin = get_dict(signIn(self.Alice_ga))
        self.Bob_signin = get_dict(signIn(self.Bob_ga))
        self.Alice = User.objects.get(id=self.Alice_signin['UID'])
        self.Bob = User.objects.get(id=self.Bob_signin['UID'])

        self.res1 = get_dict(sendMessage(
            {'message': 'from Alice to Bob', 'senderUID': self.Alice.id, 'receiverUID': self.Bob.id}))
        self.res2 = get_dict(sendMessage(
            {'message': 'from Bob to Alice', 'senderUID': self.Bob.id, 'receiverUID': self.Alice.id}))

        self.res3 = get_dict(sendMessage(
            {'message': 'from Alice to Unknown', 'senderUID': self.Alice.id, 'receiverUID': 1000}))
        self.res4 = get_dict(sendMessage(
            {'message': 'from Unknow to Alice', 'senderUID': 1000, 'receiverUID': self.Alice.id}))

    def test_return_code(self):
        self.assertEqual(self.res1['success'], 1)
        self.assertEqual(self.res2['success'], 1)
        self.assertEqual(self.res3['success'], 0)
        self.assertEqual(self.res4['success'], 0)

    def test_chatList(self):
        # total chat count should be 1, should not create chat for unknown user
        count = Chat.objects.all().count()
        self.assertEqual(count, 1)

        Alice_chatList_res = get_dict(getChatList({'UID': self.Alice.id}))
        Bob_chatList_res = get_dict(getChatList({'UID': self.Bob.id}))

        # return code
        self.assertEqual(Alice_chatList_res['success'], 1)
        self.assertEqual(Bob_chatList_res['success'], 1)

        # number of chatList of Alice and Bob should be 1
        self.assertEqual(
            len(Alice_chatList_res['chatList']), len(Bob_chatList_res['chatList']))
        self.assertEqual(
            len(Alice_chatList_res['chatList']), 1)

        # chat id
        self.assertEqual(
            Alice_chatList_res['chatList'][0]['chatID'], Bob_chatList_res['chatList'][0]['chatID'])

        # check the chat info in database is correct
        chat = Chat.objects.get(id=Alice_chatList_res['chatList'][0]['chatID'])
        self.assertEqual(chat.a.id, self.Alice.id)
        self.assertEqual(chat.b.id, self.Bob.id)
        self.assertEqual(chat.last_message.message, 'from Bob to Alice')

    def test_message(self):
        # total message count should be 2
        messages = Message.objects.all()
        self.assertEqual(messages.count(), 2)

        # check message info
        message_a = messages[0]
        message_b = messages[1]
        self.assertEqual(message_a.sender.id, self.Alice.id)
        self.assertEqual(message_a.message, 'from Alice to Bob')
        self.assertEqual(message_b.sender.id, self.Bob.id)
        self.assertEqual(message_b.message, 'from Bob to Alice')

        # backward check the chat owners
        self.assertEqual(message_a.chat.id, message_b.chat.id)
        self.assertEqual(message_a.chat.a.id, self.Alice.id)
        self.assertEqual(message_a.chat.b.id, self.Bob.id)

        # check getMessage results
        chat = message_a.chat
        res = get_dict(getMessage({'chatID': chat.id}))

        self.assertEqual(res['success'], 1)
        self.assertEqual(len(res['messageList']), 2)
        self.assertEqual(res['messageList'][0]['UID'], self.Alice.id)
        self.assertEqual(res['messageList'][0]['message'], 'from Alice to Bob')
        self.assertEqual(res['messageList'][1]['UID'], self.Bob.id)
        self.assertEqual(res['messageList'][1]['message'], 'from Bob to Alice')


class ChangeIconTestCase(TestCase):
    def setUp(self):
        # fake google account infomation for Alice and Bob
        self.Alice_ga = {
            'email': 'alice@gmail.com',
            'name': 'Alice',
            'icon': 'bad_icon.jpg'
        }

        self.Alice_signin = get_dict(signIn(self.Alice_ga))
        self.Alice = User.objects.get(id=self.Alice_signin['UID'])

        request = HttpRequest()
        request.POST['UID'] = self.Alice.id
        request.FILES['file'] = open('WeHelpServer/images/1.jpg', 'rb')

        self.res = get_dict(changeIcon(request))

    def test_code(self):
        # check if the upload image is same as the one in uri
        self.assertEqual(self.res['success'], 1)
        self.assertTrue(os.path.exists(self.res['uri']))
        self.assertTrue(
            filecmp.cmp(self.res['uri'], 'WeHelpServer/images/1.jpg', shallow=False))

        # check if the uri is written into database
        Alice = User.objects.get(id=self.Alice.id)
        self.assertEqual(self.res['uri'], Alice.icon)


class TaskTestCase(TestCase):
    def setUp(self):
        self.Alice_ga = {
            'email': 'alice@gmail.com',
            'name': 'Alice',
            'icon': 'bad_icon.jpg'
        }
        self.Bob_ga = {
            'email': 'bob@gmail.com',
            'name': 'Bob',
            'icon': 'bad_icon.jpg'
        }

        self.Alice_signin = get_dict(signIn(self.Alice_ga))
        self.Bob_signin = get_dict(signIn(self.Bob_ga))
        self.Alice = User.objects.get(id=self.Alice_signin['UID'])
        self.Bob = User.objects.get(id=self.Bob_signin['UID'])

        image_count = 4
        # Alice publish task
        request = HttpRequest()
        request.POST['UID'] = self.Alice.id
        request.POST['title'] = 'test title'
        request.POST['body'] = 'test body'
        request.POST['cost'] = 5
        request.POST['image_count'] = image_count

        for i in range(image_count):
            request.FILES[str(i)] = open(
                'WeHelpServer/images/' + str(i+2) + '.jpeg', 'rb')

        res = get_dict(sendTask(request))
        # check code
        self.assertEqual(res['success'], 1)

    def test_getActivateTask(self):
        # test getActivateTask
        res = get_dict(getActiveTask({}))
        self.assertEqual(res['success'], 1)
        self.assertEqual(len(res['taskList']), 1)
        self.assertEqual(res['taskList'][0]['UID'], self.Alice.id)

        # check images
        images = res['taskList'][0]['images']

        for i in range(len(images)):
            self.assertTrue(os.path.exists(images[i]))
            self.assertTrue(
                filecmp.cmp(images[i], 'WeHelpServer/images/' + str(i+2) + '.jpeg', shallow=False))

        # check task info
        taskID = res['taskList'][0]['taskID']
        task = Task.objects.get(id=taskID)
        self.assertEqual(task.title, 'test title')
        self.assertEqual(task.body, 'test body')
        self.assertEqual(task.cost, 5)

    def test_balance(self):
        # check publish balance
        self.assertEqual(self.Alice.coins, User.objects.get(
            id=self.Alice.id).coins + 5)

    def test_acceptTask(self):
        res = get_dict(getActiveTask({}))
        taskID = res['taskList'][0]['taskID']

        res = get_dict(acceptTask({'UID': self.Bob.id, 'taskID': taskID}))
        self.assertEqual(res['success'], 1)

        # check task active
        task = Task.objects.get(id=taskID)
        # self.assertEqual(task.acceptor.id, self.Bob.id)

        # check Bob's acceptTasks
        res = get_dict(getAcceptTask({'UID': self.Bob.id}))
        self.assertEqual(len(res['taskList']), 1)
        self.assertEqual(res['taskList'][0]['taskID'], task.id)

        # check Bob cancel accpet
        res = get_dict(cancelAccept({'UID': self.Bob.id, 'taskID': taskID}))
        res = get_dict(getAcceptTask({'UID': self.Bob.id}))
        self.assertEqual(len(res['taskList']), 0)

        # check Bob accept it again
        res = get_dict(acceptTask({'UID': self.Bob.id, 'taskID': taskID}))
        res = get_dict(getAcceptTask({'UID': self.Bob.id}))
        self.assertEqual(len(res['taskList']), 1)
        self.assertEqual(res['taskList'][0]['taskID'], task.id)

        # check Bob's acceptTask when Alice delete it
        res = get_dict(deleteTask({'UID': self.Alice.id, 'taskID': taskID}))
        res = get_dict(getAcceptTask({'UID': self.Bob.id}))
        self.assertEqual(len(res['taskList']), 0)

        # Alice publish task
        image_count = 4
        request = HttpRequest()
        request.POST['UID'] = self.Alice.id
        request.POST['title'] = 'test title'
        request.POST['body'] = 'test body'
        request.POST['cost'] = 5
        request.POST['image_count'] = image_count

        for i in range(image_count):
            request.FILES[str(i)] = open(
                'WeHelpServer/images/' + str(i+2) + '.jpeg', 'rb')

        res = get_dict(sendTask(request))
        # check code
        self.assertEqual(res['success'], 1)
        # get new taskID
        res = get_dict(getActiveTask({}))
        taskID = res['taskList'][0]['taskID']
        task = Task.objects.get(id=taskID)

        # check Bob accept it again
        res = get_dict(acceptTask({'UID': self.Bob.id, 'taskID': taskID}))
        res = get_dict(getAcceptTask({'UID': self.Bob.id}))
        self.assertEqual(len(res['taskList']), 1)
        self.assertEqual(res['taskList'][0]['taskID'], task.id)

        # Alice confirm the task is finished
        # check Bob's acceptTask
        res = get_dict(finishTask({'UID': self.Alice.id, 'taskID': taskID}))
        res = get_dict(getAcceptTask({'UID': self.Bob.id}))
        self.assertEqual(len(res['taskList']), 0)

        # check Bob's balance
        self.assertEqual(self.Bob.coins + 5,
                         User.objects.get(id=self.Bob.id).coins)

        # check Alice rates Bob
        res = get_dict(sendRating({'UID': self.Bob.id, 'rating': 3.4}))
        self.assertEqual(res['success'], 1)

        # check getUser info
        # Bob
        res = get_dict(getUser({'UID': self.Bob.id}))
        self.assertEqual(res['success'], 1)
        self.assertEqual(res['rating'], 3.4)
        self.assertEqual(res['finish_count'], 1)
        self.assertEqual(res['publish_count'], 0)
        self.assertEqual(len(res['contributions']), 1)

        # Alice
        res = get_dict(getUser({'UID': self.Alice.id}))
        self.assertEqual(res['success'], 1)
        self.assertEqual(res['rating'], 0)
        self.assertEqual(res['finish_count'], 0)
        self.assertEqual(res['publish_count'], 1)
        self.assertEqual(len(res['contributions']), 1)

        # finally check the task active status
        self.assertFalse(Task.objects.get(id=taskID).active)


# this testcase requires the server is up
class ChannelTestCase(TestCase):

    async def read_websocket(self, UID):
        uri = "ws://34.94.101.183/ws/WeHelp/" + str(UID) + "/"
        async with websockets.connect(uri) as ws:
            while (True):
                ret = await ws.recv()
                self.buffer[UID].append(json.dumps(ret))

    def setup():

        self.buffer = []

        # check if server is up
        # res = requests.post('http://34.94.101.183/WeHelp/',
                            data = json.dumps({'func': 'getUser', 'UID': 1}))
