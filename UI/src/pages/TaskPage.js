import React from 'react';
import Constants from 'expo-constants';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { AppleCard } from 'react-native-apple-card-views'
import { createStackNavigator } from '@react-navigation/stack';
import { TaskDetailPage } from './TaskDetailPage';
import { UserDetailPage } from './UserDetailPage';
import { ChatPage } from './ChatPage';

const Stack = createStackNavigator();

export function TaskPage() {
    return (
        <Stack.Navigator headerMode='false'> 
            <Stack.Screen name='TaskMainPage' component={TaskMainPage}/>
            <Stack.Screen name='TaskDetailPage' component={TaskDetailPage}/>
            <Stack.Screen name='UserDetailPage' component={UserDetailPage}/>
            <Stack.Screen name='ChatPage' component={ChatPage}/>
        </Stack.Navigator>
    );
}

function TaskMainPage(props) {
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
         }
    ]
    return (
        <View style={{flex: 1, justifyContent: 'space-between', backgroundColor: 'white'}}>
            <View style={{flex: 8, top:Constants.statusBarHeight}}>
                <ScrollView contentContainerStyle={{paddingBottom:Constants.statusBarHeight}}>
                    <Text style={{fontSize:30, padding: 10}}>Current Tasks</Text>
                    {users.map((u, i) => {
                        return <TaskCard user={u} key={i} navigation={props.navigation}/>
                    })}
                    <Text style={{fontSize:30, padding: 10}}>Past Tasks</Text>
                    {users.map((u, i) => {
                        return <TaskCard user={u} key={i} navigation={props.navigation}/>
                    })}
                </ScrollView>
            </View>
        </View>
    );
}

function TaskCard(props) {
    return(
        <AppleCard
            style={styles.containerStyle}
            smallTitle={props.user.name}
            largeTitle="Title"
            footnoteText={props.user.description}
            largeTitleTextStyle={styles.largeTitleTextStyle}
            smallTitleTextStyle={styles.smallTitleTextStyle}
            footnoteTextStyle={styles.footnoteTextStyle}
            source={{uri: props.user.avatar}}
            backgroundStyle={styles.backgroundStyle}
            onPress={() => {props.navigation.navigate('TaskDetailPage', {user:props.user});}}
        />
    )
}

const styles = StyleSheet.create({
    containerStyle: {
        padding: 5,
        width: '100%'
    },
    largeTitleTextStyle: {
        fontSize: 35,
        color: 'white'
    },
    smallTitleTextStyle: {
        fontSize: 15,
        color: 'white'
    },
    footnoteTextStyle: {
        fontSize: 24,
        color: 'black',
        backgroundColor: '#D5DBDB7F'
    },
    backgroundStyle: {
        width: '100%',
        height: 350
    }
})