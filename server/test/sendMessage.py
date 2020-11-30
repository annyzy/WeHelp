import json
import requests

for a in {15}:
    for b in {7, 8, 11, 12, 13}:
        if (a == b):
            continue
        b = {'func': 'sendMessage', 'senderUID': a, 'receiverUID': b, 'message': 'Sugoi'}
        res = requests.post('http://34.94.101.183/WeHelp/', data=json.dumps(b))
        print(res.text)

#b = {'func': 'sendMessage', 'senderUID': 8, 'receiverUID': 7, 'message': 'kao'}
#res = requests.post('http://34.94.101.183/WeHelp/', data=json.dumps(b))
#print(res.text)
