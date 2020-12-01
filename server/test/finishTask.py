import json
import requests

b = {'func': 'finishTask', 'UID': 2, 'taskID': 4, 'rating': 4.5}

#res = requests.post('http://34.94.101.183/WeHelp/', data=json.dumps(b))
res = requests.post('http://localhost:8000/WeHelp/', data=json.dumps(b))

print(res.text)
