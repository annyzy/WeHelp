import json
import requests

b = {'func': 'getChatList', 'UID': 7}

res = requests.post('http://34.94.101.183/WeHelp/', data=json.dumps(b))

print(res.text)
