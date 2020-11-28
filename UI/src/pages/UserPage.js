import React, { useCallback, useContext, useState } from 'react';
import { View, ScrollView, Text, Image, Platform, TouchableOpacity, Button } from 'react-native';
import { Rating } from 'react-native-elements';
import { PageHeader } from '../components/PageHeader';
import { UserContext} from '../components/UserContext';
import { EventRegister } from 'react-native-event-listeners';
import * as expoImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';
import CalendarHeatmap from 'react-native-calendar-heatmap';

export function UserPage(props) {
    const user = useContext(UserContext)[0];

    return (
        <View style={{flex: 1, justifyContent: 'flex-start', backgroundColor: 'white'}}>
            <PageHeader 
              leftComp={<Button title='Back' onPress={() => props.navigation.goBack()} />}
              centerComp={<Text>User</Text>} 
              rightComp={<Button title={"Sign Out"}
                          onPress={() => {EventRegister.emit('signOutUser')}}/>}
            />
            <ScrollView contentContainerStyle={{paddingBottom:Constants.statusBarHeight}}>
              <View style={{borderBottomWidth: 0.5, flexDirection:'row', justifyContent:'space-around'}}>
                <View>
                <ImagePicker user={user}/>
                <Text style={{fontSize:25, alignSelf: 'center'}}>{user.name}</Text>
                </View>
                <View style={{alignSelf:'flex-end', padding:5}}>
                  <Rating
                    type='heart'
                    readonly
                    ratingCount={5}
                    imageSize={18}
                    showRating
                    showReadOnlyText={false}
                  />
                  <Text style={{ fontSize: 20, textAlign: 'center'}}>👏🏻 5</Text>
                </View>
              </View>
              <View style={{top:20}}>
                <Text style={{fontSize:30, padding: 10, borderBottomWidth: 0.5}}>Contributions</Text>
                <CalendarHeatmap
                  endDate={new Date()}
                  numDays={120}
                  colorArray={["#eee", "#5099E1"]}
                  values={[
                    { date: '2020-11-01' },
                    { date: '2020-11-02' },
                    { date: '2020-11-22' },
                    { date: '2020-11-25' },
                  ]}
                />

                <Text style={{fontSize:30, padding: 10, borderBottomWidth: 0.5}}>Current Tasks</Text>
                
                <Text style={{fontSize:30, padding: 10, borderBottomWidth: 0.5}}>Past Tasks</Text>
              </View>
            </ScrollView>

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
      }} style={{width:150, height:150, borderRadius:25, alignSelf:"center"}}/>
    </TouchableOpacity>
  );
}