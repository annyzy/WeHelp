import React, { useCallback } from 'react';
import { Button, View, Text, Image } from 'react-native';
import { PageHeader } from '../components/PageHeader';
import * as Google from 'expo-google-app-auth';
/**
 * LoginPage is a page component that contains a button which will invokes the Google App Auth API
 * to acquire user information from user's Google account.
 * After the Google Auth API return the user information sucessfully, LoginPage will update the user information
 * using the callback function named changeUser declared in App.js
 * @export
 * @param {{changeUser: Function}} props props.changeUser is a callback function from App.js which can be used to change login user's properties.
 * @return {Component} => Render a LoginPage to redirect the user to login using Google account
 */
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
            props.changeUser(name, found['icon'], email, found['UID'], found['coins'], found['rating'], found['publish_count'], found['finish_count'], found['contributions']);
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
        <PageHeader centerComp={<Text style={{fontSize: 18, fontWeight: "bold"}}>Login Page</Text>} />
        <Image source={require('../../assets/icon.png')} style={ {alignSelf: 'center'} }/>
        <Button title='Sign in with Google' onPress={signIn}/>
        <View></View>
      </View>
    );
}
