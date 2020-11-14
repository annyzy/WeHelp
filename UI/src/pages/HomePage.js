import React from 'react';
import { View, Text, StatusBar, Image, ScrollView } from 'react-native';
import { SearchBar, Card, Button } from 'react-native-elements';
import Constants from 'expo-constants';

export function HomePage() {
    var keyword;
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
            img: ['https://avatars1.githubusercontent.com/u/23393819?s=400&u=7a3a81849ae6c9ef83bb35c31d6826224f8b6528&v=4',
                'https://avatars1.githubusercontent.com/u/23393819?s=400&u=7a3a81849ae6c9ef83bb35c31d6826224f8b6528&v=4',
                'https://avatars1.githubusercontent.com/u/23393819?s=400&u=7a3a81849ae6c9ef83bb35c31d6826224f8b6528&v=4',
                'https://avatars1.githubusercontent.com/u/23393819?s=400&u=7a3a81849ae6c9ef83bb35c31d6826224f8b6528&v=4']
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
            img: ['https://avatars1.githubusercontent.com/u/23393819?s=400&u=7a3a81849ae6c9ef83bb35c31d6826224f8b6528&v=4',
                'https://avatars1.githubusercontent.com/u/23393819?s=400&u=7a3a81849ae6c9ef83bb35c31d6826224f8b6528&v=4',
                'https://avatars1.githubusercontent.com/u/23393819?s=400&u=7a3a81849ae6c9ef83bb35c31d6826224f8b6528&v=4',
                'https://avatars1.githubusercontent.com/u/23393819?s=400&u=7a3a81849ae6c9ef83bb35c31d6826224f8b6528&v=4']
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
            img: ['https://avatars1.githubusercontent.com/u/23393819?s=400&u=7a3a81849ae6c9ef83bb35c31d6826224f8b6528&v=4',
                'https://avatars1.githubusercontent.com/u/23393819?s=400&u=7a3a81849ae6c9ef83bb35c31d6826224f8b6528&v=4',
                'https://avatars1.githubusercontent.com/u/23393819?s=400&u=7a3a81849ae6c9ef83bb35c31d6826224f8b6528&v=4',
                'https://avatars1.githubusercontent.com/u/23393819?s=400&u=7a3a81849ae6c9ef83bb35c31d6826224f8b6528&v=4']
         },
       ]
    return (
        <View style={{flex: 1, justifyContent: 'space-between', backgroundColor:'white'}}>
            <StatusBar barStyle='dark-content'/>
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
                    onChangeText = {keyword}
                />
            </View>
            <View style={{flex: 8, top:Constants.statusBarHeight}}>
                <ScrollView>
                    {
                        users.map((u, i) => {
                            return (
                                <Card containerStyle={{marginHorizontal: 5, marginVertical:5, padding:5}}>
                                    <View style={{height: 280}}>
                                        <View style={{flexDirection:'row', flex: 9}}>
                                            <View style={{flexDirection:'column', justifyContent:'flex-start', flex:1, alignItems:'center'}}>
                                                <Image source={{uri: u.avatar}} style={{borderWidth:"2", flex:1.2, borderRadius:15, width: '85%'}} resizeMode='cover'/>
                                                <View style={{flex: 4}}>
                                                    <Text style={{fontSize:'15', textAlign:'center'}}>{u.name}</Text>
                                                    <Text style={{fontSize:'15', textAlign:'center'}}>Coin = 0</Text>
                                                    <Text style={{fontSize:'15', textAlign:'center'}}>rating = 0</Text>
                                                </View>
                                            </View>

                                            <View style={{flexDirection:'column', justifyContent:'space-between', flex:4}}>
                                                <View style={{flex:1}}>
                                                <Text style={{fontSize: 20, textAlign:'center'}}>Title: my name is {u.name}</Text>
                                                </View>
                                                <View style={{flex:8, borderWidth:'2', padding:5, justifyContent:'space-between'}}>
                                                    <Text style={{flex: 4}}>Text Text Text Text Text Text Text Text Text Text Text</Text>
                                                    <View style={{flexDirection:'row', justifyContent:'flex-start', flex: 2}}>
                                                        <Image source={{uri: u.img[0]}} style={{width:"25%"}} resizeMode='contain'/>
                                                        <Image source={{uri: u.img[1]}} style={{width:"25%"}} resizeMode='contain'/>
                                                        <Image source={{uri: u.img[2]}} style={{width:"25%"}} resizeMode='contain'/>
                                                        <Image source={{uri: u.img[3]}} style={{width:"25%"}} resizeMode='contain'/>
                                                    </View>
                                                </View>
                                                <View style={{flexDirection:'row', justifyContent:"space-between",flex: 1}}>
                                                    <Text style={{fontSize:'20'}}>0 likes</Text>
                                                    <View style={{flexDirection:'row', justifyContent:'flex-end',flex: 9}}>
                                                        <Text style={{fontSize:'20'}}>❤️</Text>
                                                        <Text style={{fontSize:'20'}}>💬</Text>
                                                        <Text style={{fontSize:'20'}}>✅</Text>
                                                    </View>
                                                </View>
                                            </View>

                                        </View>
                                    </View>
                                </Card>
                            )
                        })
                    }
                </ScrollView>
            </View>
        </View>
    );
}