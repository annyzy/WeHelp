import requests
import json

url = 'http://localhost:8000/WeHelp/'
body = {'func': 'sendRating', 'UID': 2, 'rating': 4.5}

response = requests.post(url, data=json.dumps(body))

print(response.text)
