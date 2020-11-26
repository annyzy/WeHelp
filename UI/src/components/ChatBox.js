import React, { useState, useCallback, useEffect, useContext } from 'react';
import { View } from 'react-native';
import { GiftedChat, Avatar, Bubble, Time } from 'react-native-gifted-chat';
import { LinearGradient } from 'expo-linear-gradient';
import { UserContext } from './UserContext';
  
export function ChatBox(props) {
    const user = useContext(UserContext)[0];
    const chat = props.chat;

    //change this to event trigger to update chat and send post request to server
    const onSend = useCallback((messages = []) => 
      {setMessages((previousMessages) => GiftedChat.append(previousMessages, messages));}, []);
  
    return (  
      <GiftedChat
        messages={chat['messages']}
        onSend={messages => {onSend(messages)}}
        alwaysShowSend={true}
        renderAvatar={renderAvatar}
        renderBubble={renderBubble}
        renderTime={renderTime}
        multiline={true}
        isLoadingEarlier={true}
        //user={{
        //  _id: user.UID,
        //  name: user.name,
        //  avatar: user.photoUrl,
        //}}
        user = {{
            _id: user.UID,
            name: user.name,
            avatar: user.photoUrl
        }}
      />
    );
  }

function renderAvatar(props) {
    return(
      <Avatar
        {...props}
        imageStyle={{
            left:{
              bottom:5,
              borderBottomLeftRadius: 5,
              borderBottomRightRadius: 5,
              borderTopLeftRadius: 5,
              borderTopRightRadius: 5
            },
            right:{
              bottom:5,
              borderBottomLeftRadius: 5,
              borderBottomRightRadius: 5,
              borderTopLeftRadius: 5,
              borderTopRightRadius: 5
            }
        }}
      />
    );
  }
  
function renderBubble(props) {
    return (
      <View 
      style={{
          borderBottomLeftRadius: 15,
          borderBottomRightRadius: 15,
          borderTopLeftRadius: 15,
          borderTopRightRadius: 15,
          overflow: 'hidden',
          }}>
        <LinearGradient
          colors={['#5099E1', '#27DAF0']}
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
          }}
        />
        <Bubble
            {...props}
            wrapperStyle={{
              right: {
                backgroundColor: 'transparent',
                marginLeft: 0
              },
              left: {
                backgroundColor: 'transparent',
                marginRight: 0,
              }
            }}
            textStyle={{
              right: {
                color: 'white'
              },
              left: {
                color: 'white'
              }
            }}
          />
        </View>
    );
}
  
function renderTime(props) {
    return (
      <Time 
        {...props}
        timeTextStyle= {{
          left: {
            color: '#fff'
          },
          right: {
            color: '#fff'
          }
        }}
      />
    );
}