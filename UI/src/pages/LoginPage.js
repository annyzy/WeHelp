import React, { useCallback } from 'react';
import { Button, View, Text } from 'react-native';
import { PageHeader } from '../components/PageHeader';
import * as Google from 'expo-google-app-auth';

export function LoginPage (props) {
  let signIn = useCallback(async () => {
    try {
      const result = await Google.logInAsync({
        androidClientId: '916471448464-s7gervtibhhm4749f6bfe5kv91vqo30f.apps.googleusercontent.com',
        iosClientId: '916471448464-0ar23dtivdilvgpro4fkq3f126js8rh3.apps.googleusercontent.com',
        scopes: ['profile', 'email']
      })
    
      if (result.type === 'success') {
        props.changeUser(result.user.name, result.user.photoUrl);
      } else {
        console.log('cancelled')
      }
    } catch (e) {
      console.log('error', e)
    }
  }, []);

    return (
      <View style={ {flex:1, justifyContent: 'space-between', backgroundColor: 'white'} }>
        <PageHeader centerComp={<Text>Login Page</Text>} />
        <Button title='Sign in with Google' onPress={signIn}/>
        <View></View>
      </View>
    );
}