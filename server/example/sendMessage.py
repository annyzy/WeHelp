import json
import requests

#for a in {7, 8, 11, 12, 13, 14, 15, 16}:
#    for b in {7, 8, 11, 12, 13, 14, 15, 16}:
#        if (a == b):
#            continue
#        b = {'func': 'sendMessage', 'senderUID': b, 'receiverUID': a, 'message': 'Sugoi'}
#        #res = requests.post('http://34.94.101.183/WeHelp/', data=json.dumps(b))
#        res = requests.post('http://localhost:8000/WeHelp/', data=json.dumps(b))
#        print(res.text)

b = {'func': 'sendMessage', 'senderUID': 1, 'receiverUID': 3, 'message': '???'}
#res = requests.post('http://34.94.101.183/WeHelp/', data=json.dumps(b))
res = requests.post('http://localhost:8000/WeHelp/', data=json.dumps(b))
print(res.text)
