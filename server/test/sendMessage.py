import json
import requests

b = {'func': 'sendMessage', 'senderUID': 11, 'receiverUID': 7, 'message': '???'}

res = requests.post('http://localhost:8000/WeHelp/', data=json.dumps(b))

print(res.text)
