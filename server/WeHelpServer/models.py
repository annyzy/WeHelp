from django.db import models
#from django.core.validators import int_list_validator


class User(models.Model):
    coins = models.IntegerField()
    icon = models.CharField(max_length=4096)
    rating = models.FloatField()
    num_rating = models.IntegerField(default=0)
    create_date = models.DateTimeField()
    last_freecoin = models.DateTimeField(default=create_date)
    email = models.EmailField()
    name = models.CharField(max_length=64, default='')
    #chatList = models.CharField(validators=int_list_validator)
    chatList = models.CharField(max_length=4096, default='')


class Message(models.Model):
    sender = models.ForeignKey(User, on_delete=models.CASCADE)
    message = models.CharField(max_length=1024)
    date = models.DateTimeField()
    chat = models.ForeignKey(
        'Chat', on_delete=models.CASCADE, related_name='chat_message')


class Chat(models.Model):
    a = models.ForeignKey(User, on_delete=models.CASCADE,
                          related_name='user_chat_a')
    b = models.ForeignKey(User, on_delete=models.CASCADE,
                          related_name='user_chat_b')
    last_message = models.ForeignKey(
        Message, on_delete=models.CASCADE, related_name='message_chat')
    #message_list = models.CharField(validator=int_list_validator)


class Task(models.Model):
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name='publish_task')
    title = models.CharField(max_length=128)
    body = models.CharField(max_length=4096)
    acceptor = models.ForeignKey(
        User, on_delete=models.DO_NOTHING, related_name='accept_task')
    images = models.CharField(max_length=4096)
    datetime = models.DateTimeField()
    active = models.BooleanField()
    cost = models.IntegerField()
