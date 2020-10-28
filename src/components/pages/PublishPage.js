import React, { useState, useEffect } from 'react';
import { View, Button, TextInput, Platform, Image } from 'react-native';
import { PageHeader } from './PageHeader'
import * as ImagePicker from 'expo-image-picker';

export function PublishPage({navigation}) {
  return (
    <View style={{flex: 1, justifyContent: "flex-start", backgroundColor: "white"}}>
        <PageHeader
            leftComp={<Button title="Back" onPress={() => navigation.goBack()} />}
            rightComp={<Button title="Publish" onPress={() => navigation.goBack()} />}/>
        <TextInput
            style={{padding:15, fontSize:20, height: "30%"}}
            clearButtonMode="always"
            multiline={true}
            numberOfLines={20}
            autoFocus={true}
        />
        <ImagePickerExample/>
    </View>
  );
}

function ImagePickerExample() {
  const [image, setImage] = useState(null);
  let checkPermission = async () => {
    if (Platform.OS !== 'web') {
      const status = await ImagePicker.requestCameraRollPermissionsAsync();
      if (status !== 'granted') {
        alert('Photo permission is required to upload photos');
      }
    }
  };
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setImage(result.uri);
    }
  };

  useEffect(() => {
    checkPermission();
  });
  
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-start' }}>
      <Button title="Select photo" onPress={pickImage} />
      {image && <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />}
    </View>
  );
}