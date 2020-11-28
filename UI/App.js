import React, { useState, useCallback, useEffect } from 'react';
import { Platform } from 'react-native';
import { PageNavigation } from './src/components/PageNavigation';
import { LoginPage } from './src/pages/LoginPage';
import { UserContext} from './src/components/UserContext';
import { EventRegister } from 'react-native-event-listeners';
import { GiftedChat } from 'react-native-gifted-chat';

export default function App() {
  const [user, setUser] = useState({
    signedIn: false,
    name: '',
    photoUrl: '',
    UID: -1,
    email: ''
  });

  const [chatList, setChatList] = useState([]);
  /*
  chatList = ['chatID': {
    'updating': 
    'chatID':
    'avatar':
    'name': the other user's name
    'UID': the other user's UID
    'comment': last_message
    'datetime': datetime of last_message, format in %Y-%m-%d %H:%M:%S
    'messages': [{'UID', 'message'}*], sorted
  }*]
  */

 const [taskList, setTaskList] = useState([
  {
      publisher: 'Dongyao',
      publisherUID: 7,
      taskID: 0,
      avatar: 'https://avatars1.githubusercontent.com/u/23393819?s=400&u=7a3a81849ae6c9ef83bb35c31d6826224f8b6528&v=4',
      title: 'none',
      description: 'HelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHello',
      img: ['https://avatars1.githubusercontent.com/u/23393819?s=400&u=7a3a81849ae6c9ef83bb35c31d6826224f8b6528&v=4',
          'https://avatars1.githubusercontent.com/u/23393819?s=400&u=7a3a81849ae6c9ef83bb35c31d6826224f8b6528&v=4',
          'https://avatars1.githubusercontent.com/u/23393819?s=400&u=7a3a81849ae6c9ef83bb35c31d6826224f8b6528&v=4',
          'https://avatars1.githubusercontent.com/u/23393819?s=400&u=7a3a81849ae6c9ef83bb35c31d6826224f8b6528&v=4']
  },
  {
      publisher: 'Wing',
      publisherUID: 8,
      taskID:1,
      avatar: 'https://avatars3.githubusercontent.com/u/22208368?s=400&u=3d3f94c135f0c3b6de1601bce6b24c48ee735a44&v=4',
      title: 'yes',
      description: 'HelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHello',
      img: ['https://avatars1.githubusercontent.com/u/23393819?s=400&u=7a3a81849ae6c9ef83bb35c31d6826224f8b6528&v=4']
   }
])

useEffect(() => {EventRegister.addEventListener('signOutUser', signOutUser)}, []);

let signOutUser = useCallback(() => {
  setUser({
        signedIn: false,
        name: '',
        photoUrl: '',
        UID: -1,
        email: ''
      })
  setChatList([])
}, [])


  let changeUser = useCallback((newName, newPhotoUrl, newEmail, newUID) => {
    let url;
    if (newPhotoUrl.startsWith('media')) {
      url = 'http://34.94.101.183/' + newPhotoUrl;
    }
    else {
      url = newPhotoUrl;
    }
    setUser({
      signedIn: true,
      name: newName,
      photoUrl: url,
      UID: newUID,
      email: newEmail
    })
  }, []);

  useEffect(() => {EventRegister.addEventListener('iconChanged', (newUrl) => {
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
  })}, []);


  useEffect(() => {
    const sendMessageListener = EventRegister.addEventListener('sendMessage', ([newMessage, receiverUID]) => {
      //console.log(chatList)
      // --- find chat

      let chat_index = -1;
      chatList.forEach((chat, i) => {
        console.log(chat['UID']);
        if (chat['UID'] == receiverUID) {
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
          setChatList(chatList => {
            let tmp = chatList[chat_index];
            chatList[chat_index] = chatList[0];
            chatList[0] = tmp;
            return [...chatList];
          })
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
          return chatList;
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
    })
    
    return function cleanup() {
      EventRegister.removeEventListener(sendMessageListener);
    }
  })


  //TODO: add useEffect and cleanup
  useEffect(() => {
    const refreshChatListener = EventRegister.addEventListener('refreshChat', (chatID) => {
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
              return chatList;
            })
            fetch('http://34.94.101.183/WeHelp/', {
              method: 'POST',
              body: JSON.stringify({
                func: 'getMessage', chatID: chatID
              })
            }).then(async (resp) => {
              let found = await resp.json();
              if (found['success'] == 1) {
                found['messageList'].map((m, i) => {
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
              //console.log(chatList[chat_index]['messages']);
            })
          }
        }
      }
    });

    return function cleanup() {
      EventRegister.removeEventListener(refreshChatListener);
    }
  });


  useEffect(() => {
    const refreshChatListListener = EventRegister.addEventListener('refreshChatList', (UID=user.UID) => {
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
          found['chatList'].map((chat) => {
            let avatar;
            if (chat['avatarURL'].startsWith('media')){
              avatar = 'http://34.94.101.183/' + chat['avatarURL'];
            }
            else {
              avatar = chat['avatarURL'];
            }
            setChatList(chatList => chatList.concat({
              name: chat['name'], avatar: avatar, 
              comment: chat['last_message'], chatID: chat['chatID'], 
              datetime: chat['datetime'], messages: [],
              updating: false, UID: chat['UID']
            }));
          })
        }
        else {
          alert("ERROR: can not load chat list");
        }
      }) 
    })

    return function cleanup() {
      EventRegister.removeEventListener(refreshChatListListener);
    }
  })

  

  if (Platform.OS == 'web') {
    return (
    <UserContext.Provider value={[user, chatList, taskList]}>
      <PageNavigation/>
    </UserContext.Provider>
    );
  }
  else if (user.signedIn) {
    return (
      <UserContext.Provider value={[user, chatList, taskList]}>
          <PageNavigation/>
      </UserContext.Provider>
      );  
  }
  else {
    return <LoginPage changeUser={changeUser} />;
  }
}