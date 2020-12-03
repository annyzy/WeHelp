import json
import ast
from django.test import TestCase
from django.http import JsonResponse

from WeHelpServer.models import *
from WeHelpServer.views import *
# Create your tests here.


class UsageTestCase(TestCase):
    def setUp(self):
        # fake google account infomation for Alice and Bob
        self.Alice_ga = {
            'email': 'alice@gmail.com',
            'name': 'Alice',
            'icon': 'bad_icon.jpg'
        }
        self.Bob_ga = {
            'email': 'bob@gmail.com',
            'name': 'Bob',
            'icon': 'bad_icon.jpg'
        }

        self.Alice_signin = ast.literal_eval(
            signIn(self.Alice_ga).content.decode("UTF-8"))
        self.Bob_signin = ast.literal_eval(
            signIn(self.Bob_ga).content.decode("UTF-8"))
        self.Alice = User.objects.get(id=self.Alice_signin['UID'])
        self.Bob = User.objects.get(id=self.Bob_signin['UID'])

    def test_signIn_correctness(self):
        # self.assertSetEqual(self.Alice_signin.keys(), {
        #    'avatar', 'coins', 'rating', 'name', 'publish_count', 'finish_count', 'contributions'})
        self.assertEqual(self.Alice.email, self.Alice_ga['email'])
        self.assertEqual(self.Alice.name, self.Alice_ga['name'])
        self.assertLess(0, self.Alice['UID'])

    def test_signIn_unique_user(self):
        pass
