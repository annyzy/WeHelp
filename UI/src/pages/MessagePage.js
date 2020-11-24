import React, { useState, useCallback, useContext } from 'react';
import { View, Text, Alert, ScrollView } from 'react-native';
import { ListItem, Avatar } from 'react-native-elements';
import { PageHeader } from '../components/PageHeader';
import { createStackNavigator } from '@react-navigation/stack';
import { ChatPage } from './ChatPage'
import { UserContext } from '../components/UserContext';

let Stack = createStackNavigator();

export function MessagePage() {
  const chatList = useContext(UserContext)[1];

  return (
    <UserContext.Provider value={chatList}>
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



  const chatList = useContext(UserContext);
  return (
    <View style={{flex: 1, justifyContent: 'flex-start', backgroundColor: 'white'}}>
      <PageHeader centerComp={<Text>Message</Text>} />
      <ScrollView>
      {
        chatList.map((user, i) => (
          <ListItem key={i} bottomDivider 
          onPress={() => {props.navigation.navigate('ChatBox', {contactUser: user});}}
          //onLongPress={()=> {removeContact(i);}}
          >
            <Avatar source={{uri: user.avatar}} />
            <ListItem.Content>
              <ListItem.Title>{user.name}</ListItem.Title>
              <ListItem.Subtitle>{user.comment}</ListItem.Subtitle>
            </ListItem.Content>
          </ListItem>
        ))
      }
      </ScrollView> 
    </View>
  );
}