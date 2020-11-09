import json
import requests

b = {'email': 'something.com', 'func': 'signin', 'icon': 'icon.jpg'}

res = requests.post('http://34.94.101.183:80/WeHelp/', data=json.dumps(b))

print(res.text)
