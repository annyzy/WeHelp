import React, { useCallback, useContext, useState } from 'react';
import { View, ScrollView, Text, Image, Platform, TouchableOpacity, Button } from 'react-native';
import { PageHeader } from '../components/PageHeader';
import { UserContext} from '../components/UserContext';
import { EventRegister } from 'react-native-event-listeners';
import * as expoImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';

export function UserDetailPage(props) {
    const {user} = props.route.params;

    return (
        <View style={{flex: 1, justifyContent: 'flex-start', backgroundColor: 'white'}}>
            <PageHeader 
                leftComp={<Button title='Back' onPress={() => props.navigation.goBack()} />}
                centerComp={<Text>User</Text>} />
            <ScrollView contentContainerStyle={{paddingBottom:Constants.statusBarHeight}}>
              <View style={{borderBottomWidth: 0.5}}>
              <Image source={{
                    uri: user.avatar
                }} style={{width:150, height:150, borderRadius:25, alignSelf:"center"}}/>
                <Text style={{fontSize:25, alignSelf: 'center'}}>{user.name}</Text>
              </View>
              <Text style={{fontSize:30, padding: 10}}>Contributions</Text>
              <Text style={{fontSize:30, padding: 10}}>Ratings</Text>

              <Text style={{fontSize:30, padding: 10}}>Current Tasks</Text>
              
              <Text style={{fontSize:30, padding: 10}}>Past Tasks</Text>
              
            </ScrollView>

        </View>
    );
}