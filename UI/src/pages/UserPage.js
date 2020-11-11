import React, { useCallback, useContext, useState } from 'react';
import { View, Text, Image, Platform, Button } from 'react-native';
import { PageHeader } from '../components/PageHeader';
import { UserContext} from '../components/UserContext';
import { EventRegister } from 'react-native-event-listeners';
import * as expoImagePicker from 'expo-image-picker';

export function UserPage() {
    const user = useContext(UserContext);

    return (
        <View style={{flex: 1, justifyContent: 'space-between', backgroundColor: 'white'}}>
            <PageHeader centerComp={<Text>User</Text>} />
            <Image source={{
                uri: user.photoUrl
            }} style={{width:200, height:200, alignSelf:"center"}}/>
            <View style={{alignItems: 'center'}}>
                <Text>text!</Text>
                <ImagePicker/>
            </View>
            <View></View>
        </View>
    );
}

function changeImg() {
    
}

let checkPermission = async () => {
  if (Platform.OS !== 'web') {
    const status = await expoImagePicker.requestCameraRollPermissionsAsync();
    if (status.accessPrivileges === 'none') {
      alert('Photo permission is required to upload photos');
      return false;
    }
  }
  return true;
};

function ImagePicker() {
  const [imageUri, setImage] = useState(null);
  const user = useContext(UserContext);

  const pickImage = useCallback(async () => {
    let hasPermission = await checkPermission();
    if (hasPermission) {
      let result = await expoImagePicker.launchImageLibraryAsync({
        mediaTypes: expoImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
  
      if (!result.cancelled) {
        setImage(result.uri);

        //need to add more error handling
        const data = new FormData();
        data.append('func', 'changeIcon');
        data.append('UID', user.UID);
        data.append('file', {
          uri: String(result.uri),
          type: result.type,
          name: result.uri
        });
        let res = await fetch('http://34.94.101.183:80/WeHelp/', {
            method: 'POST',
            body: data,
            headers: {
                'Content-Type': 'multipart/form-data',
                //'Accept': 'multipart/form-data',
                'Accept': 'application/json'
            },
        });
        let responseJson = await res.json();
        alert(responseJson['uri']);

        EventRegister.emit('iconChanged', responseJson['uri']);
      }
    }
  }, []);

  return <Button title='change icon' onPress={() => pickImage()}/>
}