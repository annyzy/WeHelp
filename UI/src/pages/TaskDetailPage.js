import React from 'react';
import { View, ScrollView, Text, Button, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { PageHeader } from '../components/PageHeader';
import Constants from 'expo-constants';
import { Button as MaterialButton } from 'react-native-material-ui';

export function TaskDetailPage(props) {
  const {user} = props.route.params;

    return (
        <View style={{flex: 1, justifyContent: 'space-around', backgroundColor: 'white'}}>
            <PageHeader style={{flex: 1}}
                leftComp={<Button title='Back' onPress={() => props.navigation.goBack()} />}
                centerComp={<Text style={{fontSize:20}}>{user.name}</Text>}
            />
            <View style={{flex: 9}}>
                <View style={styles.userInfoView}>
                    <TouchableOpacity 
                        style={styles.avatarTouchable}
                        onPress={() => {
                            props.navigation.navigate('UserDetailPage', {user:props.user});
                        }}>
                        <Image source={{ uri: user.avatar }} style={styles.avatarStyle} resizeMode='cover'/>
                    </TouchableOpacity>
                    <View style={styles.userRatingView}>
                        <Text style={{ fontSize: 20, textAlign: 'center'}}>{user.name}</Text>
                        <View style={{flexDirection: "row", justifyContent:'space-between', width: "90%"}}>
                            <Text style={{ fontSize: 15 }}>⭐️⭐️⭐️⭐️⭐️</Text>
                            <Text style={{ fontSize: 15 }}>👏🏻 5</Text>
                        </View>
                    </View>
                </View>
                <ScrollView contentContainerStyle={{paddingBottom:Constants.statusBarHeight}}>            
                    <View style={styles.taskInfoView}>
                        <Text style={styles.taskTitleStyle}>Title: my name is {user.name}</Text>
                        <Text style={styles.taskTextBoxStyle}>Placeholder</Text>
                        <View style={styles.imageView}>
                            <View style={styles.imageVerticalView}>
                                <View style={styles.imageHorizontalView}>
                                    {user.img.length >= 1 && <Image source={{ uri: user.img[0] }} style={styles.imageStyle} />}
                                    {user.img.length >= 2 &&<Image source={{ uri: user.img[1] }} style={styles.imageStyle} />}
                                </View>
                                <View style={styles.imageHorizontalView}>
                                    {user.img.length >= 3 &&<Image source={{ uri: user.img[2] }} style={styles.imageStyle} />}
                                    {user.img.length >= 4 && <Image source={{ uri: user.img[3] }} style={styles.imageStyle} />}
                                </View>
                            </View>
                        </View>

                        <View style={styles.buttonView}>
                            <MaterialButton text={"❤️ Likes " + user.img.length} style={materialButtonStyle}/>
                            <MaterialButton text="💬 Message" style={materialButtonStyle}/>
                            <MaterialButton text="✅ Accept" style={{container:{...materialButtonStyle.container, borderRightWidth:0},
                                                            text: materialButtonStyle.text}}/>
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
        alignItems:'flex-start',
        left: 20
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
    imageView: {
        padding: 5
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
        width: 200,
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
    container: {borderRightWidth: 1, height: '100%'},
    text: {fontSize: 12, right: 8}
}