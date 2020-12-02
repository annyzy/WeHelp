import json
import requests


b = {'func': 'sendLocation', 'senderUID': 1, 'receiverUID': 2,
     'longtitude': -122.259076,
     'latitude': 37.871789
     }
res = requests.post('http://localhost:8000/WeHelp/', data=json.dumps(b))
print(res.text)
