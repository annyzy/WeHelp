import React, { useState, useCallback, useEffect } from 'react';
import { Platform } from 'react-native';
import { PageNavigation } from './src/components/PageNavigation';
import { LoginPage } from './src/pages/LoginPage';
import { UserContext} from './src/components/UserContext';
import { EventRegister } from 'react-native-event-listeners';

export default function App() {
  const [user, setUser] = useState({
    signedIn: false,
    name: 'no name',
    photoUrl: '',
    UID: -1,
    email: ''
  });

  let changeUser = useCallback((newName, newPhotoUrl, newEmail, newUID) => {
    let url;
    if (newPhotoUrl.startsWith('media')) {
      url = 'http://34.94.101.183/' + newPhotoUrl;
    }
    else {
      url = newPhotoUrl;
    }
    setUser({
      signedIn: true,
      name: newName,
      photoUrl: url,
      UID: newUID,
      email: newEmail
    })
  }, []);

  useEffect(() => {EventRegister.addEventListener('iconChanged', (newUrl) => {
    let url;
    if (newUrl.startsWith('media')) {
      url = 'http://34.94.101.183/' + newUrl;
    }
    else {
      url = newUrl;
    }
    setUser(prev => ({
      ...prev,
      photoUrl: url,
    }));
  })}, []);

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