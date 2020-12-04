
import asyncio
import websockets
import json

async def hello():
    #uri = "ws://34.94.101.183/ws/WeHelp/2/"
    uri = "ws://localhost:8000/ws/WeHelp/2/"
    async with websockets.connect(uri) as websocket:
        body = {'message': 'hahhaha'}

        await websocket.send(json.dumps(body))
        print(f"> {body}")

        greeting = await websocket.recv()
        res = json.loads(greeting)
        print(f"< {res}")

asyncio.get_event_loop().run_until_complete(hello())
print("hhahahaah")
