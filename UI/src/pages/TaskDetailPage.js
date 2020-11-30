import React, { useState, useContext } from 'react';
import { View, ScrollView, Text, Button, Image, StyleSheet, TouchableOpacity, RefreshControl } from 'react-native';
import { Rating } from 'react-native-elements';
import { PageHeader } from '../components/PageHeader';
import Constants from 'expo-constants';
import { Button as MaterialButton } from 'react-native-material-ui';
import { EventRegister } from 'react-native-event-listeners';
import { UserContext } from '../components/UserContext';
import Modal from 'react-native-modal';

const wait = (timeout) => {
    return new Promise(resolve => {
      setTimeout(resolve, timeout);
    });
}

export function TaskDetailPage(props) {
    const {task} = props.route.params;
    const [user, chatList, taskList] = useContext(UserContext);
    const [isMyTask, setIsMyTask] = useState(task['publisherUID'] === user['UID']);
    const [isAcceptedTask, setIsAcceptedTask] = useState(task['receiverUID'] === user['UID']);
    const [isCompleted, setIsCompleted] = useState(task['isCompleted']);
    const [isModalVisiable, setIsModalVisiable] = useState(false);
    const [refreshing, setRefreshing] = React.useState(false);
    const onRefresh = React.useCallback(() => {
        setRefreshing(true);

        wait(2000).then(() => setRefreshing(false));
    }, []);

    return (
        <View style={{flex: 1, justifyContent: 'space-between', backgroundColor: 'white'}}>
            <Modal isVisible={isModalVisiable}
                    onBackdropPress={() => setIsModalVisiable(false)}>
                    <View style={{backgroundColor:'white', height: '20%', justifyContent:'space-around'}}>
                        <Rating
                            type='heart'
                            ratingCount={5}
                            imageSize={30}
                            startingValue={0}
                            showRating
                        />
                        <Button title='Confirm' onPress={() => setIsModalVisiable(false)}/>
                    </View>
            </Modal>
            <PageHeader style={{flex: 1}}
                leftComp={<Button title='Back' onPress={() => props.navigation.goBack()} />}
                centerComp={<Text style={{fontSize:20}}>{task.publisher}</Text>}
            />
            <View style={{flex: 9}}>
                <View style={styles.userInfoView}>
                    <TouchableOpacity 
                        style={styles.avatarTouchable}
                        onPress={() => {
                            props.navigation.navigate('UserDetailPage', {userUID: task});
                        }}>
                        <Image source={{ uri: task.avatar }} style={styles.avatarStyle} resizeMode='cover'/>
                    </TouchableOpacity>
                    
                        <View style={{flexDirection: "row", justifyContent:'space-between', width: "85%"}}>
                            <View style={styles.userRatingView}>
                                <Text style={{ fontSize: 20, textAlign: 'center'}}>{task.publisher}</Text>
                                <Text style={{ fontSize: 20 }}>👏🏻 5</Text>
                            </View>
                            <Rating
                                style={{flex:4}}
                                type='heart'
                                readonly
                                ratingCount={5}
                                imageSize={18}
                                showRating
                                showReadOnlyText={false}
                            />
                    </View>
                </View>
                <ScrollView 
                    contentContainerStyle={{paddingBottom:Constants.statusBarHeight}}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    }
                >            
                    <View style={styles.taskInfoView}>
                        <Text style={styles.taskTitleStyle}>{task.title}</Text>
                        <Text style={styles.taskTextBoxStyle}>{task.description}</Text>
                        <View>
                            <View style={styles.imageVerticalView}>
                                <View style={styles.imageHorizontalView}>
                                    {task.img.length >= 1 && <Image source={{ uri: task.img[0] }} style={styles.imageStyle} />}
                                    {task.img.length >= 2 &&<Image source={{ uri: task.img[1] }} style={styles.imageStyle} />}
                                </View>
                                <View style={styles.imageHorizontalView}>
                                    {task.img.length >= 3 &&<Image source={{ uri: task.img[2] }} style={styles.imageStyle} />}
                                    {task.img.length >= 4 && <Image source={{ uri: task.img[3] }} style={styles.imageStyle} />}
                                </View>
                            </View>
                        </View>

                        <View style={styles.buttonView}>
                            <MaterialButton text={"👍 Rate"} style={materialButtonStyle}
                                            onPress={() => {setIsModalVisiable(true)}}/>
                            <MaterialButton text="💬 Message" style={materialButtonStyle}
                                            onPress={() => {
                                                EventRegister.emit('refreshChat', 7);
                                                props.navigation.navigate('ChatPage', {chat: chatList[0]});
                                            }}/>
                            {isAcceptedTask && <MaterialButton text="👌 Done" 
                                    style={{container:{...materialButtonStyle.container, borderRightWidth:0},
                                            text: materialButtonStyle.text}}
                                    onPress={() => {props.navigation.goBack()}}
                                    disabled={isCompleted}
                            />}
                            {isMyTask && <MaterialButton text="❌ Cancel" 
                                    style={{container:{...materialButtonStyle.container, borderRightWidth:0},
                                            text: materialButtonStyle.text}}
                                    onPress={() => {props.navigation.goBack()}}   
                                    disabled={isCompleted}             
                            />}
                            {!isMyTask && !isAcceptedTask && <MaterialButton text="✅ Accept" style={{container:{...materialButtonStyle.container, borderRightWidth:0},
                                                            text: materialButtonStyle.text}}
                                                            disabled={isCompleted}/>}
                        </View>
                    </View>
            </ScrollView>
        </View>
        </View>
    );
}

const styles = StyleSheet.create({
    userInfoView: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    userRatingView: {
        flex: 6,
        justifyContent: 'space-evenly',
        alignItems:'flex-start',
        left: 20,
    },
    avatarTouchable: {
        flex: 1,
        left: 10,
    },
    avatarStyle: {
        borderWidth: 2,
        borderRadius: 15,
        width: 60,
        height: 60
    },
    taskInfoView: {
        flexDirection: 'column',
        justifyContent: 'flex-start',
    },
    taskTitleStyle: {
        fontSize: 20,
        padding: 10
    },
    taskTextBoxStyle: {
        padding: 10,
    },
    imageVerticalView: {
        flexDirection: 'column',
        justifyContent: 'flex-start'
    },
    imageHorizontalView: {
        flexDirection: 'row',
        justifyContent: 'flex-start'
    },
    imageStyle: {
        width: '50%',
        height: 200,
        resizeMode: 'cover'
    },
    buttonView: {
        margin: 10,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        height: 35,
        borderWidth: 1,
        borderRadius: 10
    }
})

const materialButtonStyle = {
    container: {flex:3, borderRightWidth: 1, height: '100%'},
    text: {fontSize: 12, right: 8}
}