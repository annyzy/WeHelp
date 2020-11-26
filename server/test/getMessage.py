import json
import requests

b = {'func': 'getMessage', 'chatID': 1}

res = requests.post('http://34.94.101.183/WeHelp/', data=json.dumps(b))

for i in res['messageList']:
    print(i)
