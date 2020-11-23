from django.db import models
from django.core.validators import int_list_validator


class User(models.Model):
    coins = models.IntegerField()
    icon = models.CharField(max_length=4096)
    rating = models.FloatField()
    create_date = models.DateTimeField()
    email = models.EmailField()
    chatList = models.CharField(validators=int_list_validator)


class Message(models.Model):
    sender = models.ForeignKey(User, on_delete=models.CASCADE)
    message = models.CharField(max_length=1024)
    date = models.DateTimeField()


class Chat(models.Model):
    a = models.ForeignKey(User, on_delete=models.CASCADE)
    b = models.ForeignKey(User, on_delete=models.CASCADE)
    last_message = models.ForeignKey(Message, on_delete=models.CASCADE)
    message_list = models.CharField(validator=int_list_validator)
