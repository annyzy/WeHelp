from django.db import models
#from django.core.validators import int_list_validator


class User(models.Model):
    coins = models.IntegerField()
    icon = models.CharField(max_length=4096)
    rating = models.FloatField()
    create_date = models.DateTimeField()
    email = models.EmailField()
    name = models.CharField(max_length=64, default='')
    #chatList = models.CharField(validators=int_list_validator)
    chatList = models.CharField(max_length=4096, default='')


class Message(models.Model):
    sender = models.ForeignKey(User, on_delete=models.CASCADE)
    message = models.CharField(max_length=1024)
    date = models.DateTimeField()


class Chat(models.Model):
    a = models.ForeignKey(User, on_delete=models.CASCADE,
                          related_name='user_chat_a')
    b = models.ForeignKey(User, on_delete=models.CASCADE,
                          related_name='user_chat_b')
    last_message = models.ForeignKey(Message, on_delete=models.CASCADE)
    #message_list = models.CharField(validator=int_list_validator)
    message_list = models.CharField(max_length=4096)
