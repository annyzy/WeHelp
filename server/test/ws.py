
import asyncio
import websockets
import json

async def hello():
    uri = "ws://localhost:8000/ws/WeHelp/7/"
    async with websockets.connect(uri) as websocket:
        body = {'message': 'hahhaha'}

        await websocket.send(json.dumps(body))
        print(f"> {body}")

        while(True):
            greeting = await websocket.recv()
            res = json.loads(greeting)
            print(f"< {res}")

asyncio.get_event_loop().run_until_complete(hello())
