import React, { useState, useCallback } from 'react';
import { Platform } from 'react-native';
import { PageNavigation } from './src/components/PageNavigation';
import { LoginPage } from './src/pages/LoginPage';
import { UserContext } from './src/components/UserContext';

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
    return (
    <UserContext.Provider value={user}>
      <PageNavigation/>
    </UserContext.Provider>
    );
  }
  else if (user.signedIn) {
    return (
      <UserContext.Provider value={user}>
        <PageNavigation/>
      </UserContext.Provider>
      );  
  }
  else {
    return <LoginPage changeUser={changeUser} />;
  }
}