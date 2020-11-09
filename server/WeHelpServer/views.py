import json
import requests

from django.shortcuts import render
from django.utils import timezone
from django.core.exceptions import ObjectDoesNotExist
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

from WeHelpServer.models import User


def signIn(email, icon):
    try:
        user = User.objects.get(email=email)
    except ObjectDoesNotExist:
        user = User(coins=10, rating=0,
                    create_date=timezone.now(), email=email,
                    icon=icon)
        user.save()
    res = {'UID': user.id, 'coins': user.coins,
           'icon': user.icon, 'rating': user.rating}
    return JsonResponse(res)


@csrf_exempt
def index(request):
    body = json.loads(request.body)

    if (body['func'] == 'signIn'):
        return signIn(body['email'], body['icon'])

    # avoid "return none" error, need to change it later
    return signIn(body['email'], body['icon'])
