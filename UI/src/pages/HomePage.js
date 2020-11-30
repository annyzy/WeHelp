import React, { useContext } from 'react';
import { View, Text, StatusBar, Image, ScrollView, StyleSheet, TouchableOpacity, RefreshControl } from 'react-native';
import { SearchBar, Card, Rating } from 'react-native-elements';
import { Button } from 'react-native-material-ui';
import { createStackNavigator } from '@react-navigation/stack';
import { TaskDetailPage } from './TaskDetailPage';
import { UserDetailPage } from './UserDetailPage';
import { UserContext } from '../components/UserContext';
import { ChatPage } from './ChatPage';
import Constants from 'expo-constants';
import { EventRegister } from 'react-native-event-listeners';

const Stack = createStackNavigator();

const wait = (timeout) => {
    return new Promise(resolve => {
      setTimeout(resolve, timeout);
    });
}

export function HomePage() {
    return (
        <Stack.Navigator headerMode='false'> 
            <Stack.Screen name='HomeMainPage' component={HomeMainPage}/>
            <Stack.Screen name='TaskDetailPage' component={TaskDetailPage}/>
            <Stack.Screen name='UserDetailPage' component={UserDetailPage}/>
            <Stack.Screen name='ChatPage' component={ChatPage}/>
        </Stack.Navigator>
    );
}

function HomeMainPage(props) {
    const [user, chatList, taskList] = useContext(UserContext);
    const [refreshing, setRefreshing] = React.useState(false);

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);

        wait(2000).then(() => setRefreshing(false));
    }, []);

    return (
        <View style={{flex: 1, justifyContent: 'space-between', backgroundColor:'white'}}>
            <StatusBar barStyle='dark-content'/>
            <View style={{flex:1, flexDirection:'row', justifyContent:'flex-start', alignItems:'center', top:Constants.statusBarHeight}}>
                <SearchField/>
            </View>
            <View style={{flex: 8, top:Constants.statusBarHeight}}>
                <ScrollView 
                    contentContainerStyle={{paddingBottom:Constants.statusBarHeight}}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    }    
                >
                    {taskList.map((t, i) => {
                        return(!t['isCompleted'] && <CardField task={t} key={i} navigation={props.navigation}/>)
                    })}
                </ScrollView>
            </View>
        </View>
    );
}

function SearchField() {
    return(
        <>
            <Image source={require('../../assets/icon.png')} style={{flex:1, top:'1%', height:'100%'}} resizeMode='cover'/>
            <SearchBar
                inputContainerStyle={{height:'65%'}}
                containerStyle={{flex:6, backgroundColor:'white'}}
                round={true}
                platform='ios'
                clearButtonMode='always'
                showCancel={true}
                cancelButtonTitle='cancel'
            />
        </>
    );
}

function CardField(props) {
    const [user, chatList, taskList] = useContext(UserContext);

    return (
        <Card containerStyle={styles.cardContainer}>
            <View style={styles.cardContentView}>
                <View style={styles.userInfoView}>
                    <TouchableOpacity onPress={() => {
                            props.navigation.navigate('UserDetailPage', {userUID:props.task});}}>
                        <Image source={{ uri: props.task.avatar }}
                            style={styles.avatarStyle}
                            resizeMode='cover'
                        />
                    </TouchableOpacity>
                    <Text style={{fontSize: 15, textAlign: 'center'}}>{props.task.publisher}</Text>
                    <Rating
                        style={{imageSize: 15, top:20}}
                        type='heart'
                        readonly
                        ratingCount={5}
                        imageSize={15}
                        showRating
                        showReadOnlyText={false}
                    />
                    <Text style={{ fontSize: 15, textAlign: 'center', top: 40}}>👏🏻 5</Text>
                </View>

                <View style={styles.taskInfoView}>
                    <Text style={styles.taskTitleStyle}>{props.task.title}</Text>
                    <View style={styles.taskDescriptionView}>
                        <Text 
                            style={styles.taskTextBoxStyle}
                            onPress={() => { props.navigation.navigate('TaskDetailPage', {task:props.task});} }
                        >
                            {props.task.description}
                        </Text>
                        {props.task.img.length != 0 && 
                            <View style={styles.imageView}>
                                {props.task.img.map((image, i) => {
                                    return (<Image source={{ uri: image }} style={styles.imageStyle} key={i} />);
                                })}
                            </View>
                        }
                    </View>
                    <View style={styles.buttonView}>
                        <Button text={"❤️ Likes " + props.task.img.length} style={materialButtonStyle}/>
                        <Button text="💬 Message" style={materialButtonStyle}
                                onPress={() => {
                                    EventRegister.emit('refreshChat', 7);
                                    props.navigation.navigate('ChatPage', {chat: chatList[0]})}}
                        />
                        <Button text="🔥 More" style={{container:{...materialButtonStyle.container, borderRightWidth:0},
                                                        text: materialButtonStyle.text}}
                                                onPress={() => { props.navigation.navigate('TaskDetailPage', {task:props.task});} }
                        />
                    </View>
                </View>
            </View>
        </Card>
    );
}

const styles = StyleSheet.create({
    cardContainer: {
        marginHorizontal: 0,
        marginVertical:10,
        padding:5,
    },
    cardContentView: {
        flexDirection: 'row',
        flex: 9,
    },
    userInfoView: {
        flexDirection: 'column',
        justifyContent: 'flex-start',
        flex: 1.1,
        alignItems: 'center'
    },
    avatarStyle: {
        borderWidth: 2,
        borderRadius: 15,
        width: 60,
        height: 60
    },
    taskInfoView: {
        flexDirection: 'column',
        justifyContent: 'space-between',
        flex: 4
    },
    taskTitleStyle: {
        flex: 1,
        fontSize: 20,
        padding: 10
    },
    taskDescriptionView: {
        flex: 8,
        padding: 10,
        justifyContent: 'space-between'
    },
    taskTextBoxStyle: {
        flex: 4,
        minHeight: 100,
        maxHeight: 150
    },
    imageView: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        minHeight: 80
    },
    imageStyle: {
        width: '25%',
        resizeMode: 'contain'
    },
    buttonView: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        height: 35,
        borderWidth: 0.8,
        borderRadius: 10
    }
})

const materialButtonStyle = {
    container: {borderRightWidth: 1, height: '100%'},
    text: {fontSize: 12}
}