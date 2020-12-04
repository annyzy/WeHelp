import requests
import json

url = 'http://localhost:8000/WeHelp/'
files = {
    '0': open('/home/dliang/WeHelp/server/test/dog.jpg', 'rb'),
         }
body = {'func': 'sendTask', 'UID': 2, 'title': 'shuhua', 'body': 'HELP!', 'cost': 8,
        'image_count': 1}

response = requests.post(url, data=body, files=files)

print(response.text)
