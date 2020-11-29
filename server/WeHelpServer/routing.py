from django.urls import re_path

from . import consumers

websocket_urlpatterns = [
    re_path(r'ws/WeHelp/(?P<UID>\d+)/$',
            consumers.ClientConsumer.as_asgi()),
]
