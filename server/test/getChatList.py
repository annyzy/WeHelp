import json
import requests

b = {'func': 'getChatList', 'UID': 7}

res = requests.post('http://localhost:8000/WeHelp/', data=json.dumps(b))

print(res.text)
