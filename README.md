# WeHelp

## Table of Contents
- [WeHelp](#wehelp)
  - [Table of Contents](#table-of-contents)
  - [Project Directory Tree](#project-directory-tree)
  - [Project Demo Video](#project-demo-video)
  - [How to run this project](#how-to-run-this-project)
  - [How to debug on server](#how-to-debug-on-server)
  - [How to Generate Documentation in JavaScript](#how-to-generate-documentation-in-javascript)
  - [How to Generate Documentation in Python](#how-to-generate-documentation-in-python)
  - [How to run backend tests](#how-to-run-backend-tests)
  - [Front-end API](#front-end-api)
  - [Back-end API](#back-end-api)
  - [Test Scenarios](#test-scenarios)

## Project Directory Tree

    .
    ├── UI
    │   ├── assets
    │   │   └── icon.png
    │   ├── src
    │   │   ├── components                  #This folder contains the source code of helper components
    │   │   │   ├── ChatBox.js
    │   │   │   ├── MapObject.js
    │   │   │   ├── PageHeader.js
    │   │   │   ├── PageNavigation.js
    │   │   │   └── UserContext.js
    │   │   └── pages                       #This folder contains the source code of each page of our application
    │   │       ├── ChatPage.js
    │   │       ├── HomePage.js
    │   │       ├── LoginPage.js
    │   │       ├── MessagePage.js
    │   │       ├── PublishPage.js
    │   │       ├── TaskDetailPage.js
    │   │       ├── TaskPage.js
    │   │       ├── UserDetailPage.js
    │   │       └── UserPage.js
    │   ├── App.js                          #App.js is the start point of our development
    │   ├── app.json
    │   ├── babel.config.js
    │   ├── index.js
    │   ├── metro.config.js
    │   ├── package-lock.json               #View and install all the dependencies and packages before starting this project
    │   ├── package.json
    │   ├── styles.js
    │   └── yarn.lock
    └── server
        ├── WeHelpServer                    #App top module
        │   ├── images                      #images for test
        │   │   ├── 1.jpg
        │   │   ├── 2.jpeg
        │   │   ├── 3.jpeg
        │   │   ├── 4.jpeg
        │   │   ├── 5.jpeg
        │   │   ├── 6.jpeg
        │   │   ├── 7.png
        │   │   └── 8.jpg
        │   ├── migrations                   #database migrations
        │   │   ├── 0001_initial.py
        │   │   ├── 0002_auto_20201201_0620.py
        │   │   ├── 0003_auto_20201203_0841.py
        │   │   ├── 0004_auto_20201203_0843.py
        │   │   ├── 0005_auto_20201203_0925.py
        │   │   ├── 0006_auto_20201203_0925.py
        │   │   └── __init__.py
        │   ├── __init__.py
        │   ├── admin.py
        │   ├── apps.py
        │   ├── channelTest.py                #channel_layer test written in django.test
        │   ├── consumers.py                  #handles websocket connection
        │   ├── models.py                     #describe database tables
        │   ├── routing.py                    #routes websocket connection
        │   ├── tests.py                      #generic test written in django.test
        │   └── views.py                      #the main module to handle http requests
        ├── docs                              #documentations for backend
        │   └── views.html
        │   ├── consumers.html
        ├── example                           #examples for accessing APIs
        │   ├── a.py
        │   ├── acceptTask.py
        │   ├── cancelAccept.py
        │   ├── cat.png
        │   ├── changeIcon.py
        │   ├── deleteTask.py
        │   ├── dog.jpg
        │   ├── finishTask.py
        │   ├── getAcceptTask.py
        │   ├── getActiveTask.py
        │   ├── getChatList.py
        │   ├── getMessage.py
        │   ├── getPublishTask.py
        │   ├── getUser.py
        │   ├── sendLocation.py
        │   ├── sendMessage.py
        │   ├── sendRating.py
        │   ├── sendTask.py
        │   ├── signin.py
        │   └── ws.py
        ├── server
        │   ├── __init__.py
        │   ├── asgi.py
        │   ├── settings.py
        │   ├── urls.py
        │   └── wsgi.py
        ├── manage.py
        └── requirements.txt

## Project Demo Video
https://www.youtube.com/watch?v=hpZPOgRP6DY&feature=youtu.be

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

1. This will generate views.html file for views.py, then you need to move it to server/docs
    ```shell
    cd server/docs
    ```

    ```shell
    pydoc -w ../WeHelpServer/views.py
    ```

## How to run backend tests
1. Test one: From directory server/
   ```shell
   python manage.py test
   ```
2. Test two: this one should only run on the server node because it requires a running redis server. From directory server/
   ```shell
   python manage.py test WeHelpServer.channelTest
   ```

## Front-end API
Please refer to [UI/README.md](UI/README.md) to view front-end APIs.


## Back-end API
APIs for http requests: [server/docs/views.html](server/docs/views.html) or [view it on our website](http://34.94.101.183/media/views.html)

Documentation for websocket connections: [server/docs/consumers.html](server/docs/consumers.html) or [view it on our website](http://34.94.101.183/media/consumers.html)

## Test Scenarios
Please refer to [test/README.md](test/README.md).
