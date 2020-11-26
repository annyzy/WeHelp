import React, { useState, useCallback, useContext } from 'react';
import { View, Text, Alert, ScrollView } from 'react-native';
import { ListItem, Avatar } from 'react-native-elements';
import { PageHeader } from '../components/PageHeader';
import { createStackNavigator } from '@react-navigation/stack';
import { ChatPage } from './ChatPage'
import { UserContext } from '../components/UserContext';
import { EventRegister } from 'react-native-event-listeners';

let Stack = createStackNavigator();

export function MessagePage() {
  const [user, chatList] = useContext(UserContext);

  return (
    <UserContext.Provider value={[user, chatList]}>
      <Stack.Navigator headerMode='false'> 
        <Stack.Screen name='Contacts' component={ChatList}/>
        <Stack.Screen name='ChatBox' component={ChatPage}/>
      </Stack.Navigator>
    </UserContext.Provider>
  );
}

function ChatList(props) {

  //const removeChat = useCallback((index) => {
  //  Alert.alert('Delete this chat',
  //  '',
  //  [
  //    {
  //      text: 'Delete',
  //      onPress: () => {
  //        setContacts((prevContact) => {
  //          prevContact.splice(index, 1);
  //          return [...prevContact];
  //        })
  //      }
  //    },
  //    { text: 'Cancel',
  //      style: 'cancel'
  //    },
  //  ],
  //  { cancelable: true })
  //})



  const [user, chatList] = useContext(UserContext);
  return (
    <View style={{flex: 1, justifyContent: 'flex-start', backgroundColor: 'white'}}>
      <PageHeader centerComp={<Text>Message</Text>} />
      <ScrollView>
      {
        chatList.map((chat, i) => (
          <ListItem key={i} bottomDivider 
          onPress={() => {
            EventRegister.emit('refreshChat', chat['chatID']);
            props.navigation.navigate('ChatBox', {chat: chat});
          }}
          //onLongPress={()=> {removeContact(i);}}
          >
            <Avatar source={{uri: chat.avatar}} />
            <ListItem.Content>
              <ListItem.Title>{chat.name}</ListItem.Title>
              <ListItem.Subtitle>{chat.comment}</ListItem.Subtitle>
            </ListItem.Content>
          </ListItem>
        ))
      }
      </ScrollView> 
    </View>
  );
}