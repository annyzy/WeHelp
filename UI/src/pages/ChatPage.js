import React, { useState, useContext, useCallback } from 'react';
import { View, Text, Button } from 'react-native';
import { PageHeader } from '../components/PageHeader';
import { ChatBox } from '../components/ChatBox'
import { UserContext } from '../components/UserContext';
import { MapObject } from '../components/MapObject';
import * as expoLocation from 'expo-location';

/**
 *
 * ChatPage will is an extended page of HomePage, TaskDetailPage, and MessagePage.
 * It shows the MapObject and ChatBox for interactive user chatting experience.
 * It is also an observer that will rerender if the chatList in the App.js changed.
 *
 * @export
 * @param {{route: {params: {chat: Object}}}} props <br>
 * props.route.params.chat = {
 *           'updating': boolean
 *           'chatID': number
 *           'avatar': string
 *           'name': string, the other user's name
 *           'UID': number, the other user's UID
 *           'comment': string, last_message
 *           'datetime': datetime of last_message, format in %Y-%m-%d %H:%M:%S
 *           'messages': [{'UID', 'message'}*], sorted
 *          }
 * @return {Component} => Render a ChatPage Component that consists of a MapObject and a ChatBox
 */
export function ChatPage(props) {
    const {chat} = props.route.params;
    const [origin, setOrigin] = useState(null);
    const [loading, setLoading] = useState(false);
    const [user, chatList, taskList] = useContext(UserContext);
    
    const sendLocation = useCallback((the_origin) => {
        fetch('http://34.94.101.183/WeHelp/', {
        method: 'POST',
        body: JSON.stringify({
          func: 'sendLocation', 
          senderUID: user.UID, 
          receiverUID: chat.UID,
          latitude: the_origin['latitude'],
          longitude: the_origin['longitude']
        })
      })
    }, [user,chatList])

    

    return (
        <View style={{flex: 1, justifyContent: 'flex-start', backgroundColor: 'white'}}>
            <PageHeader 
                leftComp={<Button title='Back' onPress={() => props.navigation.goBack()} />}
                centerComp={<Text>{chat.name}</Text>}
                rightComp={<Button title='My Location' onPress={async () => {
                    if(checkLocationPermission()) {
                        setLoading(true);
                        let location = await expoLocation.getCurrentPositionAsync({});
                        setOrigin({latitude: location['coords']['latitude'], longitude:location['coords']['longitude']});
                        sendLocation({latitude: location['coords']['latitude'], longitude:location['coords']['longitude']});
                        setLoading(false);
                    }
                }}/>}    
            />
                
            <View style={{flex:1}}>
                <View style={{flex:3, borderWidth:2, justifyContent:"center", alignItems:"center"}}>
                    {!loading && <MapObject origin={origin} destination={chat['destination']} originAvatar={user.photoUrl} destinationAvatar={chat.avatar}/>}
                    {loading && <Text>Loading</Text>}

                </View>
                <View style={{flex:7}}>
                    <ChatBox chat={chat} navigation={props.navigation}/>
                </View>
            </View>
        </View>
    );
}

/**
 *
 * It will check whether the application is allowed to acess location in the device.
 * @param {none}
 * @return {boolean} 
 */
let checkLocationPermission = async () => {
    if (Platform.OS !== 'web') {
      const {status} = await expoLocation.requestPermissionsAsync();
      if (status !== 'granted') {
        alert('Location permission is required');
        return false;
      }
    }
    return true;
  };
