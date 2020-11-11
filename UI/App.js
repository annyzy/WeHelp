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
    setUser({
      signedIn: true,
      name: newName,
      photoUrl: newPhotoUrl,
      UID: newUID,
      email: newEmail
    })
  }, []);

  useEffect(() => {EventRegister.addEventListener('iconChanged', (newUrl) => {
    setUser(prev => ({
      ...prev,
      photoUrl: newUrl,
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