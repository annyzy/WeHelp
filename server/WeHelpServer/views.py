import json
import requests
import os
import random
import sys
import traceback
from requests_toolbelt.multipart import decoder

from django.shortcuts import render
from django.utils import timezone
from django.core.exceptions import ObjectDoesNotExist
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from datetime import date

from WeHelpServer.models import User


def signIn(body):
    try:
        email = body['email']
        icon = body['icon']
        user = User.objects.get(email=email)
    except ObjectDoesNotExist:
        user = User(coins=10, rating=0,
                    create_date=timezone.now(), email=email,
                    icon=icon)
        user.save()
    res = {'UID': user.id, 'coins': user.coins,
           'icon': user.icon, 'rating': user.rating}
    return JsonResponse(res)


def changeIcon(request):
    try:
        suffix = str(request.FILES['file']).split('.')[-1]
        UID = request.POST['UID']
        path = 'media/User/{}/{}-{:x}.{}'.format(UID,
                                                 date.today().strftime("%Y%m%d"), random.getrandbits(128), suffix)
        if (not os.path.exists(os.path.dirname(path))):
            os.makedirs(os.path.dirname(path))
        with open(path, 'wb+') as destination:
            for chunk in request.FILES['file']:
                destination.write(chunk)

        user = User.objects.get(id=UID)
        user.icon = path
        user.save()
        res = {'success': 1, 'uri': path}
    except Exception as e:
        print(traceback.print_exc())
        res = {'success': 0}
    return JsonResponse(res)


def upload(request):
    if (request.POST['func'] == 'changeIcon'):
        return changeIcon(request)

    # avoid "return none" error, need to change it later
    return changeIcon(request)


@csrf_exempt
def index(request):
    if (request.content_type == 'multipart/form-data'):
        return upload(request)
    else:
        body = json.loads(request.body)
        if (body['func'] == 'signIn'):
            return signIn(body)

    # avoid "return none" error, need to change it later
    return signIn(body)
