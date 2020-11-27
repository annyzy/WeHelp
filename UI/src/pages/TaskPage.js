import React, { useContext } from 'react';
import Constants from 'expo-constants';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { AppleCard } from 'react-native-apple-card-views'
import { createStackNavigator } from '@react-navigation/stack';
import { TaskDetailPage } from './TaskDetailPage';
import { UserDetailPage } from './UserDetailPage';
import { ChatPage } from './ChatPage';
import { UserContext } from '../components/UserContext';

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
    const [user, chatList, taskList] = useContext(UserContext);

    return (
        <View style={{flex: 1, justifyContent: 'space-between', backgroundColor: 'white'}}>
            <View style={{flex: 8, top:Constants.statusBarHeight}}>
                <ScrollView contentContainerStyle={{paddingBottom:Constants.statusBarHeight}}>
                    <Text style={{fontSize:30, padding: 10}}>Current Tasks</Text>
                    {taskList.map((t, i) => {
                        return <TaskCard task={t} key={i} navigation={props.navigation}/>
                    })}
                    <Text style={{fontSize:30, padding: 10}}>Past Tasks</Text>
                    {taskList.map((t, i) => {
                        return <TaskCard task={t} key={i} navigation={props.navigation}/>
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
            smallTitle={props.task.publisher}
            largeTitle={props.task.title}
            footnoteText={props.task.description}
            largeTitleTextStyle={styles.largeTitleTextStyle}
            smallTitleTextStyle={styles.smallTitleTextStyle}
            footnoteTextStyle={styles.footnoteTextStyle}
            source={{uri: props.task.avatar}}
            backgroundStyle={styles.backgroundStyle}
            onPress={() => {props.navigation.navigate('TaskDetailPage', {task:props.task});}}
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