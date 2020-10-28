import React from 'react';
import { View, Text, StatusBar, Image, Platform } from 'react-native';
import { SearchBar, Header } from 'react-native-elements'
import { PageHeader } from './PageHeader'

export function HomePage() {
    var keyword;
    return (
        <View style={{flex: 1, justifyContent: "space-between", backgroundColor:"white"}}>
            <View style={{height:"20%"}}>
                <StatusBar barStyle="dark-content"/>
                <View style={{height:"30%"}}></View>
                <View style={{flexDirection:'row', justifyContent:"space-around", height:"40%", padding:10}}>
                    <Image source={require('../../../assets/icon.png')} style={{height:"90%", width:"20%"}} resizeMode="center"/>
                    <SearchBar
                        inputContainerStyle={{height:"60%"}}
                        containerStyle={{backgroundColor:"white", width: "85%", height:"70%"}}
                        round={true}
                        platform="ios"
                        clearButtonMode="always"
                        showCancel={true}
                        cancelButtonTitle="cancel"
                        onChangeText = {keyword}
                    />
                </View>
            </View>
            <View style={{alignItems: "center"}}>
                <Text>text!</Text>
            </View>
            <View></View>
        </View>
    );
}