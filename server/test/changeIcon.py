import requests
import json

url = 'http://34.94.101.183/WeHelp/'
files = {'file': open('/home/dliang/WeHelp/server/test/cat.png', 'rb')}
body = {'func': 'changeIcon', 'UID': 2}

response = requests.post(url, data=body, files=files)

print(response.text)
