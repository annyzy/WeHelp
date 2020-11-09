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
   ps -ef | grep python
   ```
3. kill this process "python manage.py runserver ..."
   ```shell
   kill {pid}
   ```
4. ```shell
   cd /home/yao090222/WeHelp/server
   ```
5. ```shell
   source venv/bin/activate
   ```
6. ```shell
   nohup python runserver 0:80 &>> /tmp/wehelp.l.log &
   ```
7. exit imediatly, don't do anything else as root
   ```shell
   exit
   ```

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
| func="sendMessage" |  success: boolean |
| message |   |
| senderUID  |  |
| receiverUID |   |

</details>

 <details>
  <summary>post task **POST**</summary>

| body | return |
| ------------- | ------------- |
| func="postTask" |  success: boolean |
| title |   |
| description  |  |
| UID |   |
| receiverUID |
| imageArray | |

</details>
