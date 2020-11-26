import React from 'react';
import { View, ScrollView, Text, Image, Button } from 'react-native';
import { PageHeader } from '../components/PageHeader';
import Constants from 'expo-constants';
import CalendarHeatmap from 'react-native-calendar-heatmap';

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
              <Text style={{fontSize:30, padding: 10}}>Ratings</Text>

              <Text style={{fontSize:30, padding: 10}}>Current Tasks</Text>
              
              <Text style={{fontSize:30, padding: 10}}>Past Tasks</Text>
              
            </ScrollView>

        </View>
    );
}