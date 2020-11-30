import React, { useState, useCallback, useContext } from 'react';
import { View, Text, Alert, ScrollView, RefreshControl } from 'react-native';
import { ListItem, Avatar } from 'react-native-elements';
import { PageHeader } from '../components/PageHeader';
import { createStackNavigator } from '@react-navigation/stack';
import { ChatPage } from './ChatPage'
import { UserContext } from '../components/UserContext';
import { EventRegister } from 'react-native-event-listeners';
import { UserDetailPage } from './UserDetailPage';

let Stack = createStackNavigator();
const wait = (timeout) => {
  return new Promise(resolve => {
    setTimeout(resolve, timeout);
  });
}

export function MessagePage() {
  return (
    <Stack.Navigator headerMode='false'> 
      <Stack.Screen name='Contacts' component={ChatList}/>
      <Stack.Screen name='ChatPage' component={ChatPage}/>
      <Stack.Screen name='UserDetailPage' component={UserDetailPage}/>
    </Stack.Navigator>
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
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);

    wait(2000).then(() => setRefreshing(false));
  }, []);
  
  return (
    <View style={{flex: 1, justifyContent: 'flex-start', backgroundColor: 'white'}}>
      <PageHeader centerComp={<Text>Message</Text>} />
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
      {
        chatList.map((chat, i) => (
          <ListItem key={i} bottomDivider 
          onPress={() => {
            EventRegister.emit('refreshChat', chat['chatID']);
            props.navigation.navigate('ChatPage', {chat: chat});
          }}
          //onLongPress={()=> {removeContact(i);}}
          >
            <Avatar source={{uri: chat.avatar}} 
                    onPress={() => {props.navigation.navigate('UserDetailPage', {userUID: 8})}}/>
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