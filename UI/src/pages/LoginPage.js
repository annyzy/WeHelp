import React, { useCallback } from 'react';
import { Button, View, Text } from 'react-native';
import { PageHeader } from '../components/PageHeader';
import * as Google from 'expo-google-app-auth';

export function LoginPage (props) {
  let signIn = useCallback(async () => {
    let name;
    let photoUrl;
    let email;
    try {
      const result = await Google.logInAsync({
        androidClientId: '916471448464-s7gervtibhhm4749f6bfe5kv91vqo30f.apps.googleusercontent.com',
        iosClientId: '916471448464-0ar23dtivdilvgpro4fkq3f126js8rh3.apps.googleusercontent.com',
        scopes: ['profile', 'email']
      })
    
      if (result.type === 'success') {
        name = result.user.name;
        photoUrl = result.user.photoUrl;
        email = result.user.email;
        fetch('http://34.94.101.183:80/WeHelp/', 
        {
          method:'POST',
          body: JSON.stringify({
            func:'signIn', email:email, icon:photoUrl, name:name
          })})
          .then(async (resp)=>{
            let found = await resp.json();
            alert('hello ' + name + ' UID:' + found['UID'] + ' photoUrl:' + found['icon']);
            props.changeUser(name, found['icon'], email, found['UID']);
          }).catch(() => {
            alert('Fetch failed');
        });
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