import requests
import json

url = 'http://localhost:8000/WeHelp/'
files = {'file': open('/home/dliang/WeHelp/server/test/dog.jpg', 'rb')}
body = {'func': 'changeIcon', 'UID': 10}

response = requests.post(url, data=body, files=files)

print(response.text)
