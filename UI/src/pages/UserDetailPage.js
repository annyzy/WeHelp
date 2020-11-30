import React, { useContext } from 'react';
import { View, ScrollView, Text, Image, Button, RefreshControl } from 'react-native';
import { Rating } from 'react-native-elements';
import { PageHeader } from '../components/PageHeader';
import Constants from 'expo-constants';
import CalendarHeatmap from 'react-native-calendar-heatmap';
import { UserContext } from '../components/UserContext';
import { UserPage } from './UserPage';

const wait = (timeout) => {
  return new Promise(resolve => {
    setTimeout(resolve, timeout);
  });
}

export function UserDetailPage(props) {
    const {userUID} = props.route.params;
    const [user, chatList, taskList] = useContext(UserContext);

    const [refreshing, setRefreshing] = React.useState(false);
    const onRefresh = React.useCallback(() => {
      setRefreshing(true);

      wait(2000).then(() => setRefreshing(false));
    }, []);

    if(userUID === user.UID) {
      return <UserPage navigation={props.navigation}/>;
    }
    else{
        //Need to get user by userUID from server
        //and render corresponding information
      return (
        <View style={{flex: 1, justifyContent: 'flex-start', backgroundColor: 'white'}}>
            <PageHeader 
                leftComp={<Button title='Back' onPress={() => props.navigation.goBack()} />}
                centerComp={<Text>{userUID.publisher}</Text>} />
            <ScrollView 
              contentContainerStyle={{paddingBottom:Constants.statusBarHeight}}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
            >
            <View style={{borderBottomWidth: 0.5, flexDirection:'row', justifyContent:'space-around'}}>
                <View>
                  <Image source={{
                      uri: userUID.avatar
                  }} style={{width:150, height:150, borderRadius:25, alignSelf:"center"}}/>
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

                <Text style={{fontSize:30, padding: 10}}>Current Tasks</Text>
                
                <Text style={{fontSize:30, padding: 10}}>Past Tasks</Text>
              </View>
            </ScrollView>

        </View>
        );
    }
}