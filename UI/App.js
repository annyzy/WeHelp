import React, { useState, useCallback } from 'react';
import { Platform } from 'react-native';
import { PageNavigation } from './src/components/PageNavigation';
import { LoginPage } from './src/pages/LoginPage';
import { EventRegister } from 'react-native-event-listeners';

export default function App() {
  const [user, setUser] = useState({
    signedIn: false,
    name: 'no name',
    photoUrl: '',
    email: ''
  });

  let changeUser = useCallback((newName, newPhotoUrl, newEmail) => {
    setUser({
      signedIn: true,
      name: newName,
      photoUrl: newPhotoUrl,
      email: newEmail
    })
  }, []);

  if (Platform.OS == 'web') {
    return <PageNavigation/>;
  }
  else if (user.signedIn) {
    //fetch('http://34.94.101.183:80/WeHelp/', 
    //{
    //  method:'POST',
    //  body: JSON.stringify({
    //    func:'signIn', email:user.email, icon:user.photoUrl
    //  })})
    //  .then(async (resp)=>{
    //    let found = await resp.json();
    //    alert('hello ' + user.name + ' UID:' + found['UID'] + ' photoUrl:' + found['icon']);
    //    //setUser({photoUrl: found['icon'], name: user.name, signedIn: user.signedIn, email: user.email});
    //    //changeUser(user.name, found['icon'], user.email);
    //  }).catch(() => {
    //    alert('Fetch failed');
    //});
    //EventRegister.emit('iconChanged', user.photoUrl);
    return <PageNavigation/>;
  }
  else {
    return <LoginPage changeUser={changeUser} />;
  }
}