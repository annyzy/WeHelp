import React, { useState, useCallback, useEffect, Component } from 'react';
import { PageNavigation } from './src/components/PageNavigation';
import { LoginPage } from './src/pages/LoginPage';
import { UserContext} from './src/components/UserContext';
import { EventRegister } from 'react-native-event-listeners';


/**
 * App.js acts as a subject in the Observer Pattern to receive and process data from the server.
 * There are multiple EventListener and Websocket to listen to the new messages, new tasks, and new users events from the server.
 * As soon as there are new data coming from the server, App.js will notify the observers which are different funtional Pages.
 * Then, each page will rerender their components using their own methods
 * @export
 * @param {none}
 * @returns {Component} => Render LoginPage component or PageNavigation component based on the user's login status.
 */
export default function App() {

   /**
   *  @private
   *  @name user
   *  @type {Object} 
   *  user = {
   *           signedIn: boolean,
   *           name: string,
   *           photoUrl: string,
   *           UID: number,
   *           email: stromg,
   *           coins: number,
   *           rating: number,
   *           publish_count: number,
   *           finish_count: number,
   *           contributions: [{'date': datetime}*]
   *           }
   */
  const [user, setUser] = useState({
    signedIn: false,
    name: '',
    photoUrl: '',
    UID: -1,
    email: '',
    coins:0,
    rating:0,
    publish_count:0,
    finish_count:0,
    contributions:[]
  });


  /**
   *  @private
   *  @name chatList
   *  @type {Object[]} 
   *  chatList = [char*]
   *  chat =  {
   *           'updating': boolean
   *           'chatID': number
   *           'avatar': string
   *           'name': string, the other user's name
   *           'UID': number, the other user's UID
   *           'comment': string, last_message
   *           'datetime': datetime of last_message, format in %Y-%m-%d %H:%M:%S
   *           'messages': [{'UID', 'message'}*], sorted
   *          }
   */
  const [chatList, setChatList] = useState([]);
  const [isRefreshChat, setRefreshChat] = useState(false);

  /**
   *  @private
   *  @name taskList
   *  @type {Object[]} 
   *  taskList = [task*]
   *  task =  {
   *          publisher: String,
   *          publisherUID: number,
   *          receiverUID: number,
   *          taskID: number,
   *          avatar: string,
   *          rating: number,
   *          coins: number,
   *          cost: number,
   *          datetime: datetime,
   *          title: string,
   *          description: string,
   *          img: string[],
   *     }
   */
  const [taskList, setTaskList] = useState([])

  /**
   *  @private
   *  @name socket
   *  @type {WebSocket} 
   */
  const [socket, setSocket] = useState();

  /**
   *  @private
   *  @name sendMessage
   * 
   *  This function sends a string to the server, and the server will forward the string to the socket of the corresponding recevierUID.
   */
  let sendMessage = useCallback(([newMessage, receiverUID]) => {
    //console.log(chatList)
    // --- find chat

    let chat_index = -1;
    chatList.forEach((chat, i) => {
      if (chat['UID'] === receiverUID) {
        chat_index = i;
      }
    })
    if (chat_index == -1) {
      alert("can't find the chat");
      return;
    }
    else {
      let text = newMessage[0]['text'];
      console.log("chat_index: " + chat_index);
      //move this chat to top
      if (chat_index != 0) {
        setChatList(swapChat(chatList, 0, chat_index));
      } 
      //update state
      let length = chatList[0]['messages'].length;
      setChatList(chatList => {
        newMessage['_id'] = length+1;
        chatList[0]['comment'] = text;
        chatList[0]['messages'].unshift({
          _id: length + 1,
          text: text,
          pending: true,
          user: {
            _id: user.UID,
            name: user.name,
            avatar: user.photoUrl,
          }
        });
        return [...chatList];
      });

      //send to server
      fetch('http://34.94.101.183/WeHelp/', {
        method: 'POST',
        body: JSON.stringify({
          func: 'sendMessage', 
          receiverUID: receiverUID, 
          senderUID: user.UID, 
          message: text
        })
      }).then(async (resp) => {
        let found = await resp.json();
        if (found['success'] == 0) {
          alert('message not sent: ' + text);
          setChatList(chatList => {
            chatList[0]['messages'][0]['sent'] = false;
            return [...chatList];
          })
        }
        else {
          console.log("message sent");
          setChatList(chatList => {
            chatList[0]['messages'][0]['pending'] = false;
            return [...chatList];
          })
        }
      })

    }
  }, [user, chatList])


   /**
   *  @private
   *  @name addNewChat
   * 
   *  This function constructs a new chat object and inserts the new chat at index 0 of chatList.
   *  And it will redirect to the new chatPage.
   */
  let addNewChat = useCallback(([contact_name, contact_UID, avatar, last_message, date_time, navigation]) => {
    let newChatList = [...chatList];
    newChatList = newChatList.concat(newChat(-1, contact_name, contact_UID, avatar, last_message, date_time));
    setChatList(newChatList);
    navigation.navigate('ChatPage', {chat: newChatList[newChatList.length-1]});
  }, [chatList])

  /**
   *  @private
   *  @name refreshChatList
   * 
   *  This function will clean and refresh the contact chat list from the server.
   */
  let refreshChatList = useCallback(async (UID=user.UID) => {
    if (UID == -1) {
      alert("uid = -1?");
      return;
    }
    fetch('http://34.94.101.183/WeHelp/', {
      method: 'POST',
      body: JSON.stringify({
        func: 'getChatList', UID: UID
      })
    }).then(async (resp) => {
      let found = await resp.json();
      //alert(found['chatList'])
      if (found['success'] == 1) {
        let newChatList = []
        found['chatList'].map((chat) => {
          let avatar;
          if (chat['avatarURL'].startsWith('media')){
            avatar = 'http://34.94.101.183/' + chat['avatarURL'];
          }
          else {
            avatar = chat['avatarURL'];
          }
          newChatList = newChatList.concat(newChat(chat['chatID'], chat['name'], chat['UID'],
                                                   avatar, chat['last_message'], chat['datetime']));
        })
        setChatList(newChatList);
        setRefreshChat(true);
      }
      else {
        alert("ERROR: can not load chat list");
      }
    }) 
  }, []);

   /**
   *  @private
   *  @name refreshChat
   * 
   *  This function will clean and refresh chat message of each chatList object.
   */
  let refreshChat = useCallback(async (chatID) => {
    //find chatID
    let chat_index = -1;
    chatList.forEach((chat, i) => {
      if (chat['chatID'] == chatID) {
        chat_index = i;
      }
    })
    if (chat_index == -1) {
      //alert("ERROR: invalid chat " + chatID);
      return;
    }
    else{
      //only refresh if the chat has no messages
      if (chatList[chat_index]['messages'].length == 0) {
        if (chatList[chat_index]['updating']) {
          return;
        }
        else {
          //fetch chat messages and store into chatList[i]['messages']
          //fetch results:
          //{'success', 'messageList': [{'UID', 'message', 'datetime'}]}
          let u;
          setChatList(chatList => {
            chatList[chat_index]['updating'] = true;
            return [...chatList];
          })
          fetch('http://34.94.101.183/WeHelp/', {
            method: 'POST',
            body: JSON.stringify({
              func: 'getMessage', chatID: chatID
            })
          }).then(async (resp) => {
            let found = await resp.json();
            if (found['success'] == 1) {
              found['messageList'].forEach((m, i) => {
                //parse message to GiftChat style
                if (m['UID'] == user.UID){
                  u = {
                    _id: user.UID,
                    avatar: user.photoUrl,
                    name: user.name
                  }
                }
                else {
                  u = {
                    _id: m['UID'],
                    avatar: chatList[chat_index]['avatar'],
                    name: chatList[chat_index]['name'],
                  }
                }
                setChatList(chatList => {
                  chatList[chat_index]['messages'].unshift({
                    _id: i + 1,
                    text: m['message'],
                    user: u
                  });
                  chatList[chat_index]['updating'] = false;
                  return [...chatList];
                })
              })
            }
            else {
              alert("ERROR: can not load chat " + chatID);
            }
            //console.log(chatList);
          })
        }
      }
    }
  }, [user, chatList]);

   /**
   *  @private
   *  @name processNewMessage
   * 
   *  This function will construct and append the new message if it receives the new message from the server through the WebSocket.
   */
  let processNewMessage = useCallback((event) => {
    let newMessage = JSON.parse(event.data);
    console.log(newMessage['func']);
    if(newMessage['func'] === 'message') {
      let new_avatar;
      if (newMessage['avatar'].startsWith('media')){
        new_avatar = 'http://34.94.101.183/' + newMessage['avatar'];
      }
      else {
        new_avatar = newMessage['avatar'];
      }
  
       //if (chatList[0]['messages'].length == 0) {return;}
      let chat_index = -1;
      chatList.forEach((chat, i) => {
        if (chat['chatID'] == newMessage['chatID'] || chat['UID'] == newMessage['UID']) {
          chat_index = i;
        }
      })
      console.log(chat_index);
      //create a new chat if not exist
      let newChatList = [...chatList];
      if (chat_index == -1) {
        newChatList.unshift(
            newChat(newMessage['chatID'], newMessage['name'], newMessage['UID'],
                      new_avatar, newMessage['message'], newMessage['datetime'])
          );
        chat_index = 0;
      }
      //move it to top as newest chat
      else if (chat_index != 0) {
        newChatList = swapChat(newChatList, 0, chat_index);
      }
  
      let u;
       u = {
         _id: newMessage['UID'],
         avatar: new_avatar,
         name: newMessage['name'],
       }
       let m = {
         _id: newChatList[0]['messages'].length + 1,
         text: newMessage['message'],
         user: u
       };
  
      if(newChatList[0]['chatID'] == -1) {
        newChatList[0]['chatID'] = newMessage['chatID'];
      }
      newChatList[0]['comment'] = newMessage['message'];
      newChatList[0]['messages'].unshift(m);
      setChatList(newChatList);
    }
    else if(newMessage['func'] === 'location') {
      console.log(newMessage)
      let newChatList = chatList;
      newChatList.forEach((chat, i) => {
        if(chat['UID'] === newMessage['UID']) {
          newChatList[i]['destination'] = {latitude: newMessage['latitude'], longitude: newMessage['longitude']};
          setChatList(newChatList);
          return;
        }
      })
    }
  }, [chatList]);

  /**
   *  @private
   *  @name refreshTaskList
   * 
   *  This function will clean and refresh the task list from the server.
   */
  let refreshTaskList = useCallback(async () => {
    fetch('http://34.94.101.183/WeHelp/', {
      method: 'POST',
      body: JSON.stringify({
        func: 'getActiveTask'
      })
    }).then(async (resp) => {
      let found = await resp.json();
      //alert(found['chatList'])
      if (found['success'] == 1) {
        let newTaskList = [];
        found['taskList'].forEach((task) => {
          newTask(task['UID'], task['acceptorUID'], task['taskID'],
              task['cost'], task['datetime'], task['title'], task['body'], task['images'])
          .then((new_task) => {
            if(new_task != null) {
              newTaskList = newTaskList.concat(new_task);
              newTaskList.sort((a, b) => {return a['taskID'] < b['taskID']});
              setTaskList(newTaskList);
            }
          })
        })
      }
      else {
        alert("ERROR: can not load task list");
      }
    }) 
  }, [user])

  /**
   *  @private
   *  @name updateUser
   * 
   *  This function will refresh and update the current user's information.
   */
  let updateUser = useCallback(() => {
    fetch('http://34.94.101.183:80/WeHelp/', 
    {
      method:'POST',
      body: JSON.stringify({
        func:'getUser', UID: user.UID
      })})
      .then(async (resp)=>{
        let found = await resp.json();
        found['contributions'].forEach((the_date, i) => {
          found['contributions'][i] = {date: the_date};
        });
        setUser({
          signedIn: true,
          name: found['name'],
          photoUrl: found['avatar'],
          UID: user['UID'],
          email: found['email'],
          coins: found['coins'],
          rating: found['rating'],
          publish_count: found['publish_count'],
          finish_count: found['finish_count'],
          contributions: found['contributions']
        });
      }).catch(() => {
        alert('Fetch failed');
    });
  }, [user])

   /**
   *  @private
   *  @name changeUser
   * 
   *  This function will change and signin the new user's information.
   */
  let changeUser = useCallback((newName, newPhotoUrl, newEmail, newUID, newCoins, newRating, newPublishCount, newFinishCount, newContributions) => {
    let url;
    if (newPhotoUrl.startsWith('media')) {
      url = 'http://34.94.101.183/' + newPhotoUrl;
    }
    else {
      url = newPhotoUrl;
    }
    newContributions.forEach((the_date, i) => {
      newContributions[i] = {date: the_date};
    });
    setUser({
      signedIn: true,
      name: newName,
      photoUrl: url,
      UID: newUID,
      email: newEmail,
      coins: newCoins,
      rating: newRating,
      publish_count: newPublishCount,
      finish_count: newFinishCount,
      contributions: newContributions
    });
    refreshChatList(newUID);
    refreshTaskList();
  }, []);

  /**
   *  @private
   *  @name signOutUser
   * 
   *  This function will signout and empty the current user's information.
   */
  let signOutUser = useCallback(() => {
    setUser({
          signedIn: false,
          name: '',
          photoUrl: '',
          UID: -1,
          email: '',
          coins:0,
          rating:0,
          publish_count:0,
          finish_count:0,
          contributions:[]
        })
    setChatList([]);
    setTaskList([]);
    if(socket) {
      socket.close();
      setSocket();
    }
  }, [socket])

  /**
   *  @private
   *  @name iconChanged
   * 
   *  This function will change the current user's avatar.
   */
  let iconChanged = useCallback((newUrl) => {
    let url;
    if (newUrl.startsWith('media')) {
      url = 'http://34.94.101.183/' + newUrl;
    }
    else {
      url = newUrl;
    }
    setUser(prev => ({
      ...prev,
      photoUrl: url,
    }));
  }, [user])

  /**
   *  @private
   *  @name editTask
   * 
   *  This function will edit and update the task states such as accept, cancel, delete, and finish states.
   */
  let editTask = useCallback(([func, UID, taskID]) => {
    fetch('http://34.94.101.183/WeHelp/', {
      method: 'POST',
      body: JSON.stringify({
          func: func, UID: UID, taskID: taskID
      })
    }).then(async (resp) => {
        let found = await resp.json();
        if (found['success'] != 0) {
          let task_index = -1;
          let newTaskList = [...taskList];
          newTaskList.forEach((task, i) => {
            if(task.taskID == taskID) {
              task_index = i;
            }
          })
          if(taskList == -1) {
            return;
          }
          if(func === 'finishTask' || func === 'deleteTask') {
            newTaskList.splice(task_index, 1);
            updateUser();
          }
          else if(func === 'cancelAccept') {
            newTaskList[task_index].receiverUID = -1;
          }
          else if(func === 'acceptTask') {
            newTaskList[task_index].receiverUID = user.UID;
          }
          setTaskList(newTaskList);
        }
        else {
            alert(func+" failed");
        }
    })
  }, [user, taskList])
  

  /**
   *  @private
   * 
   *  Thie following useEffect hooks are for setting up the WebSocket and EventListeners
   */

  useEffect(() => {
    if(user.signedIn && !socket) {
      const new_socket = new WebSocket("ws://34.94.101.183/ws/WeHelp/" + user.UID.toString() + "/");
      setSocket(new_socket);
    }
  }, [user])

  useEffect(() => {
    if(socket) {
      socket.onmessage = processNewMessage;
    }
  }, [chatList, socket])

  useEffect(() => {
    const updateUserListener = EventRegister.addEventListener('updateUser', updateUser)
    return function cleanup() {
      EventRegister.removeEventListener(updateUserListener);
    }
  }, [user])

  useEffect(() => {
    const signOutUserListener = EventRegister.addEventListener('signOutUser', signOutUser)
    return function cleanup() {
      EventRegister.removeEventListener(signOutUserListener);
    }
  }, [socket]);

  useEffect(() => {EventRegister.addEventListener('iconChanged', iconChanged)}, []);

  useEffect(() => {
    const sendMessageListener = EventRegister.addEventListener('sendMessage', sendMessage)
    return function cleanup() {
      EventRegister.removeEventListener(sendMessageListener);
    }
  }, [user, chatList]);

  useEffect(() => {
    const addNewChatListener = EventRegister.addEventListener('addNewChat', addNewChat)
    return function cleanup() {
      EventRegister.removeEventListener(addNewChatListener);
    }
  }, [user, chatList]);

  useEffect(() => {
    const editTaskListener = EventRegister.addEventListener('editTask', editTask)
    return function cleanup() {
      EventRegister.removeEventListener(editTaskListener);
    }
  }, [user, taskList]);

  useEffect(() => {
    if(isRefreshChat) {
      chatList.forEach((chat) => {
        refreshChat(chat['chatID']);
      });
      setRefreshChat(false);
    }
  }, [isRefreshChat]);

  useEffect(() => {
    const refreshTaskListener = EventRegister.addEventListener('refreshTaskList', refreshTaskList)
    return function cleanup() {
      EventRegister.removeEventListener(refreshTaskListener);
    }
  }, [user, taskList]);
  
  

  if (user.signedIn) {
    return (
      <UserContext.Provider value={[{...user}, [...chatList], [...taskList]]}>
          <PageNavigation/>
      </UserContext.Provider>
      );  
  }
  else {
    return <LoginPage changeUser={changeUser} />;
  }
}

/**
   *  @private
   *  @name swapChat
   * 
   *  This function swaps the chats at index1 and index2 of chatList.
   */
function swapChat(chatList, index1, index2) {
  return [chatList[index2]].concat(chatList.slice(index1, index2))
                           .concat(chatList.slice(index2 + 1));
}

  /**
   *  @private
   *  @name newChat
   * 
   *  This function cosntruct a new chat object.
   */
function newChat (chat_ID, contact_name, contact_UID, avatar, last_message, date_time) {
  let temp_avatar;
  if (avatar.startsWith('media')){
    temp_avatar = 'http://34.94.101.183/' + avatar;
  }
  else {
    temp_avatar = avatar;
  }
  let chat = {
    chatID: chat_ID,
    name: contact_name,
    UID: contact_UID,
    avatar: temp_avatar,
    comment: last_message,
    datetime: date_time,
    messages: [],
    updating: false,
    destination: null
  }
  return chat;
}

/**
   *  @private
   *  @name newTask
   * 
   *  This function cosntruct a new task object.
   */
async function newTask(publisherUID, receiverUID, taskID, cost, datetime, title, description, images) {
  let task = null;
  await fetch('http://34.94.101.183/WeHelp/', {
        method: 'POST',
        body: JSON.stringify({
            func: 'getUser', UID: publisherUID
        })
        }).then(async (resp) => {
        let found = await resp.json();
        //alert(found['chatList'])
        if (found['success'] != 0) {
            if (found['avatar'].startsWith('media')){
                found['avatar'] = 'http://34.94.101.183/' + found['avatar'];
            }

            images.forEach((img, i) => {
              if (img.startsWith('media')){
                images[i] = 'http://34.94.101.183/' + img;
              }
            })

            task = {
              publisher: found['name'],
              publisherUID: publisherUID,
              receiverUID: receiverUID,
              taskID: taskID,
              avatar: found['avatar'],
              rating: found['rating'],
              coins: found['coins'],
              cost: cost,
              datetime: datetime,
              title: title,
              description: description,
              img: images,
            }
          }
        else {
            alert("ERROR: can not find user"+props.task['publisherUID']);
            return;
        }
    }) 
  // console.log(task);
  return task;
}