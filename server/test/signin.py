import json
import requests

b = {'email': 'shuhuaucla@gmail.com', 'func': 'signin', 'icon': 'icon.jpg', 'name': 'Shuhua Zhan'}

res = requests.post('http://34.94.101.183:80/WeHelp/', data=json.dumps(b))

print(res.text)
