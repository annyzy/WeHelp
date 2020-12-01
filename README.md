# WeHelp

## How to run this project

1. Intall expo on your mobile device and install npm on your computer.

2. ``` shell
   git clone https://github.com/dliang090222/WeHelp
   ```
3. ``` shell
   cd WeHelp/UI
   ```
4. ``` shell
   npm install
   ```
5. ``` shell
   npm start
   ```
6. scan the QR code using your mobile device.


## How to debug on server
server logs in /tmp/wehelp.l.log
if you want to rerun it:
1. ```shell
   sudo su
   ```
2. check if there is an existing process:
   ```shell
   ps -ef | grep daphne
   ```
3. kill this process "daphne server.asgi:application ..."
   ```shell
   kill {pid}
   ```
4. ```shell
   cd /home/yao090222/WeHelp/server
   ```
5. ```shell
   source venv/bin/activate
   ```
6. make sure docker is running redis on port 6379
   ```shell
   sudo lsof -i -P -n | grep LISTEN
   ```
7. if not:
   ```shell
   sudo systemctl start docker
   sudo docker run -p 6379:6379 -d redis:5
   ```
8. run the server
   ```shell
   nohup daphne server.asgi:application -p 80 -b 0 &> /tmp/wehelp.l.log &
   ```
9. exit imediatly, don't do anything else as root


## Making requests
 Server: http://34.94.101.183:80/WeHelp/ 
 <details>
  <summary>sign in to server **POST**</summary>
  
| body | return |
| ------------- | ------------- |
| func="signIn" | UID |
| email  | coins  |
|   | icon  |
|   | rating |

</details>

 <details>
  <summary>send message **POST**</summary>

| body | return |
| ------------- | ------------- |
| func="sendMessage" |  success: 1/0 |
| message |   |
| senderUID  |  |
| receiverUID |   |

</details>

 <details>
  <summary>post task **POST**</summary>

| body | return |
| ------------- | ------------- |
| func="postTask" |  success: 1/0 |
| title |   |
| description  |  |
| UID |   |
| receiverUID |
| imageArray | |

</details>

 <details>
  <summary>change user icon **POST (multipart/form-data)**</summary>

| body | return |
| ------------- | ------------- |
| func="changeIcon" |  success: 1/0 |
| UID | uri  |

FILES: {'file': filestream}

</details>

 <details>
  <summary>get chat list **POST**</summary>

| body | return |
| ------------- | ------------- |
| func="getChatList" |  success: 1/0 |
| UID | chatList: [{chatID, avatarURL, name, last_message, datetime, UID}]  |

</details>

 <details>
  <summary>get messages of a chat **POST**</summary>

| body | return |
| ------------- | ------------- |
| func="getMessage" |  success: 1/0 |
| chatID | messageList: [{UID, message, datetime}]  |

</details>

## How to Generate Documentation in JavaScript

1. Install documentation.js using npm

   ```shell
   npm install -g documentation
   ```

2. Write your documentaion in each js file following this format:

   ```javascript
   /**
    * 
    * Description of the function body
    *
    * @export
    * @param {type} param1 Description of param1
    * @param {type} param2 Description of param2
    * @return {number} Description of return value
    */
   export function template(param1, param2) {
      let ret;
      return ret;
   }
   ```

3. Generate the documentations and append them to README.md

   Execute the following command under the directory where contains README.md
   
   ```shell
   documentation readme UI/app.js UI/src/pages/* UI/src/components/* -s "Front-end API" -g
   ```

## Front-end API
