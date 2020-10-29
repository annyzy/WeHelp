import React from 'react';
import { View, Text, StatusBar, Image } from 'react-native';
import { SearchBar } from 'react-native-elements'
import Constants from 'expo-constants'

export function HomePage() {
    var keyword;
    return (
        <View style={{flex: 1, justifyContent: "space-between", backgroundColor:"white"}}>
            <StatusBar barStyle="dark-content"/>
            <View style={{flex:1, flexDirection:'row', justifyContent:"flex-start", alignItems:"center", top:Constants.statusBarHeight}}>
                <Image source={require('../../../assets/icon.png')} style={{flex:1, top:"1%", height:"100%"}} resizeMode="cover"/>
                <SearchBar
                    inputContainerStyle={{height:"65%"}}
                    containerStyle={{flex:6, backgroundColor:"white"}}
                    round={true}
                    platform="ios"
                    clearButtonMode="always"
                    showCancel={true}
                    cancelButtonTitle="cancel"
                    onChangeText = {keyword}
                />
            </View>
            <View style={{flex:9, justifyContent:"space-around",alignItems: "center"}}>
                <Text>text!</Text>
            </View>
        </View>
    );
}