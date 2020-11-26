import React from 'react';
import { View, Text, Button } from 'react-native';
import { PageHeader } from '../components/PageHeader';
import { ChatBox } from '../components/ChatBox'

export function ChatPage(props) {
    const {chat} = props.route.params;

    return (
        <View style={{flex: 1, justifyContent: 'flex-start', backgroundColor: 'white'}}>
            <PageHeader 
                leftComp={<Button title='Back' onPress={() => props.navigation.goBack()} />}
                centerComp={<Text>{chat.name}</Text>} />
            <View style={{flex:1}}>
                <View style={{flex:2, borderWidth:2, justifyContent:"center", alignItems:"center"}}>
                    <Text>Map!</Text>
                </View>
                <View style={{flex:8}}>
                    <ChatBox chat={chat}/>
                </View>
            </View>
        </View>
    );
}