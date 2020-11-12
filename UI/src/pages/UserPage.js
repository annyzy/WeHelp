import React, { useCallback, useContext, useState } from 'react';
import { View, Text, Image, Platform, TouchableOpacity } from 'react-native';
import { PageHeader } from '../components/PageHeader';
import { UserContext} from '../components/UserContext';
import { EventRegister } from 'react-native-event-listeners';
import * as expoImagePicker from 'expo-image-picker';

export function UserPage() {
    const user = useContext(UserContext);

    return (
        <View style={{flex: 1, justifyContent: 'space-between', backgroundColor: 'white'}}>
            <PageHeader centerComp={<Text>User</Text>} />
              <ImagePicker user={user}/>
            <View style={{alignItems: 'center'}}>
              <Text>text!</Text>
            </View>
            <View></View>
        </View>
    );
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

function ImagePicker(props) {
  const [imageUri, setImage] = useState(props.user.photoUrl);

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
          data.append('UID', props.user.UID);
          data.append('file', {
            uri: String(result.uri),
            type: 'image/jpeg',
            name: result.uri
          }
        );
        fetch('http://34.94.101.183:80/WeHelp/', {
            method: 'POST',
            body: data,
            headers: {
                'Content-Type': 'multipart/form-data',
                'Accept': 'application/json',
                //'contentType': false,
                //'processData': false,
                //'mimeType': 'multipart/form-data',
                //'cache-control': 'no-cache',
            },
        })
        .then(async (res) => {
          let responseJson = await res.json();
          EventRegister.emit('iconChanged', responseJson['uri']);
        })
        .catch(()=>{alert("Upload Picture Failed");});
      }
    }
  }, []);

  return (
    <TouchableOpacity onPress={() => {pickImage()}}>
      <Image source={{
        uri: imageUri
      }} style={{width:200, height:200, alignSelf:"center"}}/>
    </TouchableOpacity>
  );
}