import json
import requests

b = {'func': 'acceptTask', 'UID': 1, 'taskID': 4}

#res = requests.post('http://34.94.101.183/WeHelp/', data=json.dumps(b))
res = requests.post('http://localhost:8000/WeHelp/', data=json.dumps(b))

print(res.text)
