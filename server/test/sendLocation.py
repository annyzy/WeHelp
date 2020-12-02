import json
import requests


b = {'func': 'sendLocation', 'senderUID': 1, 'receiverUID': 2,
     'longtitude': -122.259076,
     'latitude': 37.871789
     }
res = requests.post('http://34.94.101.183/WeHelp/', data=json.dumps(b))
print(res.text)
