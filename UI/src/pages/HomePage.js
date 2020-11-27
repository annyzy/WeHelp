import React from 'react';
import { View, Text, StatusBar, Image, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { SearchBar, Card } from 'react-native-elements';
import { Button } from 'react-native-material-ui';
import { createStackNavigator } from '@react-navigation/stack';
import { TaskDetailPage } from './TaskDetailPage';
import { UserDetailPage } from './UserDetailPage';
import { UserContext } from '../components/UserContext';
import { ChatPage } from './ChatPage';
import Constants from 'expo-constants';
import { EventRegister } from 'react-native-event-listeners';

const Stack = createStackNavigator();

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
    const users = [
        {
            name: 'Dongyao',
            avatar: 'https://avatars1.githubusercontent.com/u/23393819?s=400&u=7a3a81849ae6c9ef83bb35c31d6826224f8b6528&v=4',
            description: 'HelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHello',
            img: ['https://avatars1.githubusercontent.com/u/23393819?s=400&u=7a3a81849ae6c9ef83bb35c31d6826224f8b6528&v=4',
                'https://avatars1.githubusercontent.com/u/23393819?s=400&u=7a3a81849ae6c9ef83bb35c31d6826224f8b6528&v=4',
                'https://avatars1.githubusercontent.com/u/23393819?s=400&u=7a3a81849ae6c9ef83bb35c31d6826224f8b6528&v=4',
                'https://avatars1.githubusercontent.com/u/23393819?s=400&u=7a3a81849ae6c9ef83bb35c31d6826224f8b6528&v=4']
        },
        {
            name: 'Wing',
            avatar: 'https://avatars3.githubusercontent.com/u/22208368?s=400&u=3d3f94c135f0c3b6de1601bce6b24c48ee735a44&v=4',
            description: 'HelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHello',
            img: ['https://avatars1.githubusercontent.com/u/23393819?s=400&u=7a3a81849ae6c9ef83bb35c31d6826224f8b6528&v=4']
         },
         {
            name: 'Dongyao',
            avatar: 'https://avatars1.githubusercontent.com/u/23393819?s=400&u=7a3a81849ae6c9ef83bb35c31d6826224f8b6528&v=4',
            description: 'HelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHello',
            img: ['https://avatars1.githubusercontent.com/u/23393819?s=400&u=7a3a81849ae6c9ef83bb35c31d6826224f8b6528&v=4',
                'https://avatars1.githubusercontent.com/u/23393819?s=400&u=7a3a81849ae6c9ef83bb35c31d6826224f8b6528&v=4',
                'https://avatars1.githubusercontent.com/u/23393819?s=400&u=7a3a81849ae6c9ef83bb35c31d6826224f8b6528&v=4',
                'https://avatars1.githubusercontent.com/u/23393819?s=400&u=7a3a81849ae6c9ef83bb35c31d6826224f8b6528&v=4']
        },
        {
            name: 'Wing',
            avatar: 'https://avatars3.githubusercontent.com/u/22208368?s=400&u=3d3f94c135f0c3b6de1601bce6b24c48ee735a44&v=4',
            description: 'HelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHello',
            img: []
         },
         {
            name: 'Dongyao',
            avatar: 'https://avatars1.githubusercontent.com/u/23393819?s=400&u=7a3a81849ae6c9ef83bb35c31d6826224f8b6528&v=4',
            description: 'HelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHello',
            img: ['https://avatars1.githubusercontent.com/u/23393819?s=400&u=7a3a81849ae6c9ef83bb35c31d6826224f8b6528&v=4',
                'https://avatars1.githubusercontent.com/u/23393819?s=400&u=7a3a81849ae6c9ef83bb35c31d6826224f8b6528&v=4',
                'https://avatars1.githubusercontent.com/u/23393819?s=400&u=7a3a81849ae6c9ef83bb35c31d6826224f8b6528&v=4']
        },
        {
            name: 'Wing',
            avatar: 'https://avatars3.githubusercontent.com/u/22208368?s=400&u=3d3f94c135f0c3b6de1601bce6b24c48ee735a44&v=4',
            description: 'HelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHello',
            img: ['https://avatars1.githubusercontent.com/u/23393819?s=400&u=7a3a81849ae6c9ef83bb35c31d6826224f8b6528&v=4',
                'https://avatars1.githubusercontent.com/u/23393819?s=400&u=7a3a81849ae6c9ef83bb35c31d6826224f8b6528&v=4']
         },
       ]
    return (
        <View style={{flex: 1, justifyContent: 'space-between', backgroundColor:'white'}}>
            <StatusBar barStyle='dark-content'/>
            <View style={{flex:1, flexDirection:'row', justifyContent:'flex-start', alignItems:'center', top:Constants.statusBarHeight}}>
                <SearchField/>
            </View>
            <View style={{flex: 8, top:Constants.statusBarHeight}}>
                <ScrollView contentContainerStyle={{paddingBottom:Constants.statusBarHeight}}>
                    {users.map((u, i) => {
                        return(<CardField user={u} key={i} navigation={props.navigation}/>)
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
    return (
        <Card containerStyle={styles.cardContainer}>
            <View style={styles.cardContentView}>
                <View style={styles.userInfoView}>
                    <TouchableOpacity onPress={() => {
                            props.navigation.navigate('UserDetailPage', {user:props.user});}}>
                        <Image source={{ uri: props.user.avatar }}
                            style={styles.avatarStyle}
                            resizeMode='cover'
                        />
                    </TouchableOpacity>
                    <Text style={{ fontSize: 20, textAlign: 'center'}}>{props.user.name}</Text>
                    <Text style={{ fontSize: 10, textAlign: 'center', top: 10}}>⭐️⭐️⭐️⭐️⭐️</Text>
                    <Text style={{ fontSize: 15, textAlign: 'center', top: 20}}>👏🏻 5</Text>
                </View>

                <View style={styles.taskInfoView}>
                    <Text style={styles.taskTitleStyle}>Title: my name is {props.user.name}</Text>
                    <View style={styles.taskDescriptionView}>
                        <Text 
                            style={styles.taskTextBoxStyle}
                            onPress={() => { props.navigation.navigate('TaskDetailPage', {user:props.user});} }
                        >
                            Placeholder
                        </Text>
                        {props.user.img.length != 0 && 
                            <View style={styles.imageView}>
                                {props.user.img.map((image, i) => {
                                    return (<Image source={{ uri: image }} style={styles.imageStyle} key={i} />);
                                })}
                            </View>
                        }
                    </View>
                    <View style={styles.buttonView}>
                        <Button text={"❤️ Likes " + props.user.img.length} style={materialButtonStyle}/>
                        <Button text="💬 Message" style={materialButtonStyle}
                                onPress={() => {
                                    EventRegister.emit('refreshChat', 7);
                                    props.navigation.navigate('ChatPage', {chatIndex: 0})}}
                        />
                        <Button text="✅ Accept" style={{container:{...materialButtonStyle.container, borderRightWidth:0},
                                                        text: materialButtonStyle.text}}
                                                onPress={() => { props.navigation.navigate('TaskDetailPage', {user:props.user});} }
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