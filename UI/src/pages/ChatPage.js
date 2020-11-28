import React, { useState, useContext } from 'react';
import { View, Text, Button } from 'react-native';
import { PageHeader } from '../components/PageHeader';
import { ChatBox } from '../components/ChatBox'
import { UserContext } from '../components/UserContext';
import { MapObject } from '../components/MapObject';

export function ChatPage(props) {
    const {chat} = props.route.params;


    return (
        <View style={{flex: 1, justifyContent: 'flex-start', backgroundColor: 'white'}}>
            <PageHeader 
                leftComp={<Button title='Back' onPress={() => props.navigation.goBack()} />}
                centerComp={<Text>{chat.name}</Text>} />
            <View style={{flex:1}}>
                <View style={{flex:3, borderWidth:2, justifyContent:"center", alignItems:"center"}}>
                    <MapObject origin={{latitude: 34.0689122, longitude: -118.4478093}} destination={{latitude: 34.067057, longitude: -118.441606}}/>
                </View>
                <View style={{flex:7}}>
                    <ChatBox chat={chat} navigation={props.navigation}/>
                </View>
            </View>
        </View>
    );
}