import React, { useState, useContext } from 'react';
import { View, Text, Button } from 'react-native';
import { PageHeader } from '../components/PageHeader';
import { ChatBox } from '../components/ChatBox'
import { UserContext } from '../components/UserContext';

export function ChatPage(props) {
    const [chatIndex, setChatIndex] = useState(props.route.params["chatIndex"]);
    const [user, chatList] = useContext(UserContext);

    return (
        <View style={{flex: 1, justifyContent: 'flex-start', backgroundColor: 'white'}}>
            <PageHeader 
                leftComp={<Button title='Back' onPress={() => props.navigation.goBack()} />}
                centerComp={<Text>{chatList[chatIndex].name}</Text>} />
            <View style={{flex:1}}>
                <View style={{flex:2, borderWidth:2, justifyContent:"center", alignItems:"center"}}>
                    <Text>Map!</Text>
                </View>
                <View style={{flex:8}}>
                    <ChatBox chatIndex={chatIndex} navigation={props.navigation}/>
                </View>
            </View>
        </View>
    );
}