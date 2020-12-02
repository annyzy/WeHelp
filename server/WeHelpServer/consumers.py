import json
from channels.generic.websocket import WebsocketConsumer
import channels.layers
from asgiref.sync import async_to_sync


class ClientConsumer(WebsocketConsumer):
    def connect(self):
        # use UID as group name
        self.UID = self.scope['url_route']['kwargs']['UID']

        # add this consumer to group
        async_to_sync(self.channel_layer.group_add)(
            self.UID,
            self.channel_name
        )

        self.accept()

    def disconnect(self, close_code):
        async_to_sync(self.channel_layer.group_discard)(
            self.UID,
            self.channel_name
        )

    def receive(self, text_data):
        pass

    def chat_message(self, event):
        # event =
        # {
        #   'chatID':
        #   'avatar':
        #   'name':
        #   'UID': senderUID
        #   'datetime':
        #   'message':
        # }

        self.send(text_data=json.dumps({
            'chatID': event['chatID'],
            'avatar': event['avatar'],
            'name': event['name'],
            'UID': event['UID'],
            'datetime': event['datetime'],
            'message': event['message'],
            'func': 'message'
        }))

    def chat_location(self, event):
        # event = {
        #    'UID':
        #    'datetime':
        #    'longtitude':
        #    'latitude':
        # }

        self.send(text_data=json.dumps({
            'UID': event['UID'],
            'datetime': event['datetime'],
            'longtitude': event['longtitude'],
            'latitude': event['latitude'],
            'func': 'message'
        }))
