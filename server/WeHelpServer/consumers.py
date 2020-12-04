import json
from channels.generic.websocket import WebsocketConsumer
import channels.layers
from asgiref.sync import async_to_sync


"""
Consumers.py is mainly about managing websockets of users.

1. ***connect*** - is a function to group users with the same UID but different socket together.
2. ***disconnect*** - disconnect users according to the UID
3. ***receive*** - do nothing when receive data since chats are handled by HTTPS
4. ***chat_message*** - send messages with all parameter values to clients.
5. ***chat_location*** - send location with all parameter values to clients.

"""

class ClientConsumer(WebsocketConsumer):
    # === connect ===
    def connect(self):
        # use UID as group name
        self.UID = self.scope['url_route']['kwargs']['UID']

        # add this consumer to group
        async_to_sync(self.channel_layer.group_add)(
            self.UID,
            self.channel_name
        )

        self.accept()

    # === disconnect ===
    def disconnect(self, close_code):
        async_to_sync(self.channel_layer.group_discard)(
            self.UID,
            self.channel_name
        )

    # === receive ===
    def receive(self, text_data):
        pass

    # === chat_message ===
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

    # === chat_location ===
    def chat_location(self, event):
        # event = {
        #    'UID':
        #    'datetime':
        #    'longitude':
        #    'latitude':
        # }

        self.send(text_data=json.dumps({
            'UID': event['UID'],
            'datetime': event['datetime'],
            'longitude': event['longitude'],
            'latitude': event['latitude'],
            'func': 'location'
        }))
