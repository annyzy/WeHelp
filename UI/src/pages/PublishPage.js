import React, { useState, useCallback } from 'react';
import { View, Button, TextInput, Platform, Image, Alert, TouchableOpacity, Text } from 'react-native';
import { PageHeader } from '../components/PageHeader';
import * as expoImagePicker from 'expo-image-picker';
import * as expoLocation from 'expo-location';

export function PublishPage({navigation}) {
  let shareLocation = useCallback(async () => {
    await checkLocationPermission();
    await getLoation();
  }, []);
  
  return (
    <View style={{flex:1, backgroundColor: 'white'}}>
        <PageHeader
            leftComp={<Button title='Back' onPress={() => navigation.goBack()} />}
            rightComp={<Button title='Publish' onPress={() => navigation.goBack()} />}/>
        <View style={{flexDirection:'row', justifyContent:'space-between', padding:15}}>
          <Text style={{flex:1, fontSize:30}}>Title: </Text>
          <TextInput
            placeholder='Required'
            style={{flex:4, fontSize:24,borderBottomWidth:1, borderBottomColor:'black'}}
            autoFocus={true}
            multiline={false}
            clearButtonMode='always'
            numberOfLines={1}
            enablesReturnKeyAutomatically={true}
          />
        </View>
        <TextInput
            placeholder='Description'
            style={{padding:15, fontSize:20, height: '20%',}}
            clearButtonMode='always'
            multiline={true}
            numberOfLines={15}
            enablesReturnKeyAutomatically={true}
        />
        <View style={{alignSelf:'flex-end'}}>
          <Button title='Share location' onPress={() => shareLocation()} />
        </View>
        <ImagePicker/>
    </View>
  );
}

let checkImagePermission = async () => {
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
  const [imageArray, setImageArray] = useState([null, null, null, null]);
  const [imageCount, setImageCount] = useState(0);

  const pickImage = useCallback(async (index, incrementCount) => {
    let hasPermission = await checkImagePermission();
    if (hasPermission) {
      let result = await expoImagePicker.launchImageLibraryAsync({
        mediaTypes: expoImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
  
      if (!result.cancelled) {
        let array = Array.from(imageArray);
        array[index] = result.uri;
        if(incrementCount) {
          setImageCount(imageCount+1)
        }
        setImageArray(array);
      }
    }
  }, [imageArray]);

  const DeleteImage = useCallback(async(index) => {
    let array = Array.from(imageArray);
    let moveForward = false;
    for (let i =0;i < imageCount-1;i++) {
      if (i == index) {
        moveForward = true
      }
      if (moveForward) {
        array[i] = array[i+1]
      }
    }
    array[imageCount-1] = null;
    setImageCount(imageCount-1)
    setImageArray(array)
  }, [imageArray]);

  const pressImage = useCallback(async(index) => {
    if(Platform.OS === 'web') {
      alert('Cannot modify image on web at this point');
    }
    else {
      Alert.alert('Image Options',
      '',
      [
        {
          text: 'Reselect Image',
          onPress: async() => await pickImage(index, false)
        },
        {
          text: 'Delete Image',
          onPress: () => DeleteImage(index)
        },
        { text: 'Cancel',
          style: 'cancel'
        }
      ],
      { cancelable: true })
    }
  }, [imageArray]);

  const imageStyle = { width: 100, height: 100 };
  
  return (
    <View style={{padding:10}}>
      <View style={{flexDirection: 'row', justifyContent: 'flex-start'}}>
        {imageArray[0] && 
          <TouchableOpacity onPress={()=>{pressImage(0)}}>
            <Image source={{ uri: imageArray[0] }} style={imageStyle}/>
          </TouchableOpacity>
        }
        {imageArray[1] && 
          <TouchableOpacity onPress={()=>{pressImage(1)}}>
            <Image source={{ uri: imageArray[1] }} style={imageStyle}/>
          </TouchableOpacity>
        }
        {imageArray[2] && 
          <TouchableOpacity onPress={()=>{pressImage(2)}}>
            <Image source={{ uri: imageArray[2] }} style={imageStyle}/>
          </TouchableOpacity>
        }
        {imageArray[3] && 
          <TouchableOpacity onPress={()=>{pressImage(3)}}>
            <Image source={{ uri: imageArray[3] }} style={imageStyle}/>
          </TouchableOpacity>
        }
        { imageCount < 4 &&  <Button title='Select photo' onPress={() => {pickImage(imageCount, true);}} />}
      </View>
    </View>
  );
}

let checkLocationPermission = async () => {
  if (Platform.OS !== 'web') {
    const {status} = await expoLocation.requestPermissionsAsync();
    if (status !== 'granted') {
      alert('Location permission is required');
      return false;
    }
  }
  return true;
};

async function getLoation() {
  let location = await expoLocation.getCurrentPositionAsync({});
  console.log(location);
  return location;
}