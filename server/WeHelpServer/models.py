from django.db import models


class User(models.Model):
    coins = models.IntegerField()
    icon = models.ImageField()
    rating = models.FloatField()
    create_date = models.DateTimeField()
    email = models.EmailField()
