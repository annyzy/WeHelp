import React, { useState, useCallback, useEffect } from 'react';
import { PageNavigation } from './src/components/PageNavigation';
import { LoginPage } from './src/pages/LoginPage';
import { UserContext} from './src/components/UserContext';
import { EventRegister } from 'react-native-event-listeners';

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
  chatList = [{
    'updating': 
    'chatID':
    'avatar':
    'name': the other user's name
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

  let refreshChatList = useCallback((UID=user.UID) => {
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
      newChatList = []
      if (found['success'] == 1) {
        found['chatList'].map((chat) => {
          let avatar;
          if (chat['avatarURL'].startsWith('media')){
            avatar = 'http://34.94.101.183/' + chat['avatarURL'];
          }
          else {
            avatar = chat['avatarURL'];
          }
          newChatList = newChatList.concat({
            name: chat['name'], avatar: avatar, 
            comment: chat['last_message'], chatID: chat['chatID'], 
            datetime: chat['datetime'], messages: [],
            updating: false,
          });
        })
        setChatList(newChatList);
      }
      else {
        alert("ERROR: can not load chat list");
      }
    }) 
  }, [user]);

  let refreshChat = useCallback((chatID) => {
    //find chatID
    let chat_index = -1;
    chatList.map((chat, i) => {
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
                  chatList[chat_index]['messages'] = chatList[chat_index]['messages'].concat({
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
            console.log(chatList[chat_index]['messages']);
          })
        }
      }
    }
  }, [user, chatList]);

  useEffect(() => {EventRegister.addEventListener('signOutUser', signOutUser)}, []);
  useEffect(() => {EventRegister.addEventListener('iconChanged', iconChanged)}, [user]);
  useEffect(() => {EventRegister.addEventListener('refreshChatList', refreshChatList)}, [user]);
  useEffect(() => {EventRegister.addEventListener('refreshChat', refreshChat)}, [user, chatList]);

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
    });
    refreshChatList(newUID);
  }, []);

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