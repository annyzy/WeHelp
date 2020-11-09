from django.db import models


class User(models.Model):
    coins = models.IntegerField()
    icon = models.CharField(max_length=4096)
    rating = models.FloatField()
    create_date = models.DateTimeField()
    email = models.EmailField()
