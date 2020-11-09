import React, { useState, useCallback } from 'react';
import { Platform } from 'react-native';
import { PageNavigation } from './src/components/PageNavigation';
import { LoginPage } from './src/pages/LoginPage';

export default function App() {
  const [user, setUser] = useState({
    signedIn: false,
    name: 'no name',
    photoUrl: ''
  });

  let changeUser = useCallback((newName, newPhotoUrl) => {
    setUser({
      signedIn: true,
      name: newName,
      photoUrl: newPhotoUrl
    })
  }, []);

  if (Platform.OS == 'web') {
    return <PageNavigation/>;
  }
  else if (user.signedIn) {
    fetch('http://34.94.101.183:80/WeHelp/', 
    {
      method:'POST',
      body: JSON.stringify({
        func:'signIn', email:'1', icon:photoUrl
      })})
      .then(async (resp)=>{
        let found = await resp.json();
        alert('hello ' + user.name + ' UID:' + found['UID']);
      }).catch(() => {
        alert('Fetch failed');
    })
    alert('hello ' + user.name + ' UID:' + 'NUlL');
    return <PageNavigation/>;
  }
  else {
    return <LoginPage changeUser={changeUser} />;
  }
}