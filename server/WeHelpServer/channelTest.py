# this testcase should run on the server
import unittest
import time
import json
import socket
import threading
import asyncio
import websockets
import requests
import channels.layers
from asgiref.sync import async_to_sync
from django.test import TestCase


class ChannelTestCase(TestCase):

    async def listen_websocket(self, UID):
        uri = "ws://34.94.101.183/ws/WeHelp/" + str(UID) + "/"
        async with websockets.connect(uri) as ws:
            ret = await ws.recv()
            res = json.loads(ret)
            self.buffer.insert(UID, res)

    def loop_in_thread(self, i):
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        loop.run_until_complete(self.listen_websocket(i))

    async def listen_websocket_2(self, UID):
        uri = "ws://34.94.101.183/ws/WeHelp/" + str(UID) + "/"
        async with websockets.connect(uri) as ws:
            ret = await ws.recv()
            res = json.loads(ret)
            self.buffer.append(res)

    def loop_in_thread_2(self, i):
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        loop.run_until_complete(self.listen_websocket_2(i))

    def setUp(self):
        self.buffer = []
        self.sockets = []
        # check if server is up
        res = requests.post('http://34.94.101.183/WeHelp/',
                            data=json.dumps({'func': 'getUser', 'UID': 1}))
        hostname = socket.gethostname()
        IPAddr = socket.gethostbyname(hostname)

        # this test must run on the server
        if ((res.status_code == 200) & (IPAddr == '10.168.0.2') & (hostname == 'instance-1')):
            self.server_up = True
        else:
            self.server_up = False

    def test_message_direction(self):
        if (self.server_up == False):
            self.skipTest()

        self.buffer = []
        # open 10 websocket connect to server, with different UID
        threads = []
        for i in range(10):
            t = threading.Thread(target=self.loop_in_thread, args=(i,))
            t.start()
            threads.append(t)

        # lazy to wait for all socket connected
        time.sleep(4)

        for i in range(10):
            event = {
                'type': 'chat.message',
                'chatID': 1,
                'avatar': 'test.ipg',
                'name': 'channel test',
                'UID': 10000,
                'datetime': 'now',
                'message': 'to ' + str(i)
            }
            channel_layer = channels.layers.get_channel_layer()
            async_to_sync(channel_layer.group_send)(str(i), event)

        for i in range(10):
            threads[i].join(timeout=10)

        self.assertEqual(len(self.buffer), 10)
        for i in range(10):
            self.assertEqual(self.buffer[i]['message'], 'to ' + str(i))

    def test_one_user_multiple_client(self):
        if (self.server_up == False):
            self.skipTest()

        self.buffer = []
        # open 10 websocket connect to server, with same UID
        threads = []
        for i in range(10):
            t = threading.Thread(target=self.loop_in_thread_2, args=(100,))
            t.start()
            threads.append(t)

        # lazy to wait for all socket connected
        time.sleep(4)

        # only send once
        event = {
            'type': 'chat.message',
            'chatID': 1,
            'avatar': 'test.ipg',
            'name': 'channel test',
            'UID': 10000,
            'datetime': 'now',
            'message': 'to ' + str(100)
        }
        channel_layer = channels.layers.get_channel_layer()
        async_to_sync(channel_layer.group_send)(str(100), event)

        for i in range(10):
            threads[i].join(timeout=10)

        self.assertEqual(len(self.buffer), 10)
        # test all websocket should receive one copy of the message
        for i in range(10):
            self.assertEqual(self.buffer[i]['message'], 'to ' + str(100))
