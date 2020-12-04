# WeHelp

## Table of Contents
- [WeHelp](#wehelp)
  * [How to run this project](#how-to-run-this-project)
  * [How to debug on server](#how-to-debug-on-server)
  * [How to Generate Documentation in JavaScript](#how-to-generate-documentation-in-javascript)
  * [How to Generate Documentation in Python](#how-to-generate-documentation-in-python)
  * [Front-end API](#front-end-api)
  * [Back-end API](#back-end-api)

## How to run this project

1.  Intall expo on your mobile device and install npm on your computer.

2.  ```shell
    git clone https://github.com/dliang090222/WeHelp
    ```
3.  ```shell
    cd WeHelp/UI
    ```
4.  ```shell
    npm install
    ```
5.  ```shell
    npm start
    ```
6.  scan the QR code using your mobile device.

## How to debug on server

server logs in /tmp/wehelp.l.log
if you want to rerun it:
1. ```shell
   sudo su

    2. check if there is an existing process:
    ```shell
    ps -ef | grep daphne

3.  kill this process "daphne server.asgi:application ..."
    ```shell
    kill {pid}
    ```
4.  ```shell
    cd /home/yao090222/WeHelp/server
    ```
5.  ```shell
    source venv/bin/activate
    ```
6.  make sure docker is running redis on port 6379
    ```shell
    sudo lsof -i -P -n | grep LISTEN
    ```
7.  if not:
    ```shell
    sudo systemctl start docker
    sudo docker run -p 6379:6379 -d redis:5
    ```
8.  run the server
    ```shell
    nohup daphne server.asgi:application -p 80 -b 0 &> /tmp/wehelp.l.log &
    ```
9.  exit imediatly, don't do anything else as root


## How to Generate Documentation in JavaScript

1.  Install documentation.js using npm

    ```shell
    npm install -g documentation
    ```

2.  Write your documentaion in each js file following this format:

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

3.  Generate the documentation and append them to README.md

    Execute the following command under the directory where contains README.md
    
    ```shell
    cd UI/
    ```

    ```shell
    documentation readme app.js src/pages/* src/components/* -s "Front-end API" -g
    ```
    
## How to Generate Documentation in Python


## Front-end API
Please refer to [UI/README.md](README.md) to view front-end APIs.


## Back-end API
APIs for http requests: [server/docs/views.html](server/docs/views.html) or [view it on our website](http://34.94.101.183/media/views.html)
