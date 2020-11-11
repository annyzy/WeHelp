import React, { useState, useCallback } from 'react';
import { View, Text, Alert, ScrollView } from 'react-native';
import { ListItem, Avatar } from 'react-native-elements';
import { PageHeader } from '../components/PageHeader';
import { createStackNavigator } from '@react-navigation/stack';
import { ChatPage } from './ChatPage'

let Stack = createStackNavigator();

export function MessagePage() {
  return (
    <>
      <Stack.Navigator headerMode='false'> 
        <Stack.Screen name='Contacts' component={contactList}/>
        <Stack.Screen name='ChatBox' component={ChatPage}/>
      </Stack.Navigator>
    </>
  );
}

function contactList(props) {

  const [contacts, setContacts] = useState([
    {
      name: 'Dongyao',
      avatar: 'https://avatars1.githubusercontent.com/u/23393819?s=400&u=7a3a81849ae6c9ef83bb35c31d6826224f8b6528&v=4',
      comment: 'Hello!'
    },
    {
      name: 'Wing',
      avatar: 'https://avatars3.githubusercontent.com/u/22208368?s=400&u=3d3f94c135f0c3b6de1601bce6b24c48ee735a44&v=4',
      comment: 'Hi~'
    },    {
      name: 'Dongyao',
      avatar: 'https://avatars1.githubusercontent.com/u/23393819?s=400&u=7a3a81849ae6c9ef83bb35c31d6826224f8b6528&v=4',
      comment: 'Hello!'
    },
    {
      name: 'Wing',
      avatar: 'https://avatars3.githubusercontent.com/u/22208368?s=400&u=3d3f94c135f0c3b6de1601bce6b24c48ee735a44&v=4',
      comment: 'Hi~'
    },    {
      name: 'Dongyao',
      avatar: 'https://avatars1.githubusercontent.com/u/23393819?s=400&u=7a3a81849ae6c9ef83bb35c31d6826224f8b6528&v=4',
      comment: 'Hello!'
    },
    {
      name: 'Wing',
      avatar: 'https://avatars3.githubusercontent.com/u/22208368?s=400&u=3d3f94c135f0c3b6de1601bce6b24c48ee735a44&v=4',
      comment: 'Hi~'
    },
    {
      name: 'Wing',
      avatar: 'https://avatars3.githubusercontent.com/u/22208368?s=400&u=3d3f94c135f0c3b6de1601bce6b24c48ee735a44&v=4',
      comment: 'Hi~'
    },
    {
      name: 'Wing',
      avatar: 'https://avatars3.githubusercontent.com/u/22208368?s=400&u=3d3f94c135f0c3b6de1601bce6b24c48ee735a44&v=4',
      comment: 'Hi~'
    },
    {
      name: 'Wing',
      avatar: 'https://avatars3.githubusercontent.com/u/22208368?s=400&u=3d3f94c135f0c3b6de1601bce6b24c48ee735a44&v=4',
      comment: 'Hi~'
    },
    {
      name: 'Wing',
      avatar: 'https://avatars3.githubusercontent.com/u/22208368?s=400&u=3d3f94c135f0c3b6de1601bce6b24c48ee735a44&v=4',
      comment: 'Hi~'
    },
    {
      name: 'Wing',
      avatar: 'https://avatars3.githubusercontent.com/u/22208368?s=400&u=3d3f94c135f0c3b6de1601bce6b24c48ee735a44&v=4',
      comment: 'Hi~'
    },
    {
      name: 'Wing',
      avatar: 'https://avatars3.githubusercontent.com/u/22208368?s=400&u=3d3f94c135f0c3b6de1601bce6b24c48ee735a44&v=4',
      comment: 'Hi~'
    }
  ]);

  const removeContact = useCallback((index) => {
    Alert.alert('Delete this chat',
    '',
    [
      {
        text: 'Delete',
        onPress: () => {
          setContacts((prevContact) => {
            prevContact.splice(index, 1);
            return [...prevContact];
          })
        }
      },
      { text: 'Cancel',
        style: 'cancel'
      },
    ],
    { cancelable: true })
  })


  return (
    <View style={{flex: 1, justifyContent: 'flex-start', backgroundColor: 'white'}}>
      <PageHeader centerComp={<Text>Message</Text>} />
      <ScrollView>
      {
        contacts.map((user, i) => (
          <ListItem key={i} bottomDivider 
          onPress={() => {props.navigation.navigate('ChatBox', {contactUser: user});}}
          onLongPress={()=> {removeContact(i);}}
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