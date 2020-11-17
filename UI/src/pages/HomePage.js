import React from 'react';
import { View, Text, StatusBar, Image, ScrollView, StyleSheet } from 'react-native';
import { SearchBar, Card } from 'react-native-elements';
import Constants from 'expo-constants';

export function HomePage() {
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
            img: ['https://avatars1.githubusercontent.com/u/23393819?s=400&u=7a3a81849ae6c9ef83bb35c31d6826224f8b6528&v=4']
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
            <SearchField/>
            <View style={{flex: 8, top:Constants.statusBarHeight}}>
                <ScrollView>
                    {users.map((u, i) => {
                        return(<CardField user={u} key={i}/>)
                    })}
                </ScrollView>
            </View>
        </View>
    );
}

function SearchField() {
    return(
        <View style={{flex:1, flexDirection:'row', justifyContent:'flex-start', alignItems:'center', top:Constants.statusBarHeight}}>
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
        </View>
    );
}

function CardField(props) {
    return (
        <Card containerStyle={styles.cardContainer}>
            <View style={styles.cardContentView}>
                <View style={styles.userInfoView}>
                    <Image source={{ uri: props.user.avatar }} style={styles.avatarStyle} resizeMode='cover' />

                    {/* Need to chagne */}
                    <View style={{ flex: 4 }}>
                        <Text style={{ fontSize: 15, textAlign: 'center' }}>{props.user.name}</Text>
                        <Text style={{ fontSize: 15, textAlign: 'center' }}>Coin = 0</Text>
                        <Text style={{ fontSize: 15, textAlign: 'center' }}>rating = 0</Text>
                    </View>
                    {/* Need to chagne */}

                </View>

                <View style={styles.taskInfoView}>
                    <Text style={styles.taskTitleStyle}>Title: my name is {props.user.name}</Text>
                    <View style={styles.taskDescriptionView}>
                        <Text style={styles.taskTextBoxStyle}>Text Text Text Text Text Text Text Text Text Text Text</Text>
                        <View style={styles.imageView}>
                            {props.user.img.map((image, i) => {
                                return (<Image source={{ uri: image }} style={styles.imageStyle} resizeMode='contain' key={i} />);
                            })}
                        </View>
                    </View>
                    <View style={styles.actionView}>

                        {/* Need to chagne */}
                        <Text style={{ fontSize: 20 }}>0 likes</Text>
                        <View style={{ flexDirection: 'row', justifyContent: 'flex-end', flex: 9 }}>
                            <Text style={{ fontSize: 20 }}>❤️</Text>
                            <Text style={{ fontSize: 20 }}>💬</Text>
                            <Text style={{ fontSize: 20 }}>✅</Text>
                        </View>
                        {/* Need to chagne */}

                    </View>
                </View>
            </View>
        </Card>
    );
}

const styles = StyleSheet.create({
    cardContainer: {
        marginHorizontal: 5,
        marginVertical:5,
        padding:5
    },
    cardContentView: {
        flexDirection: 'row',
        flex: 9,
        height:280
    },
    userInfoView: {
        flexDirection: 'column',
        justifyContent: 'flex-start',
        flex: 1,
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
        textAlign: 'center'
    },
    taskDescriptionView: {
        flex: 8,
        padding: 10,
        justifyContent: 'space-between' 
    },
    taskTextBoxStyle: {
        flex: 4
    },
    imageView: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        flex: 2
    },
    imageStyle: {
        width: '25%'
    },
    actionView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        flex: 1
    }
})