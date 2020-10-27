import React from 'react';
import { View, Text, StatusBar, Platform } from 'react-native';
import { SearchBar, Header } from 'react-native-elements'
import { PageHeader } from './PageHeader'

export function HomePage() {
    var keyword;
    return (
        <View style={{flex: 1, justifyContent: "space-between", backgroundColor:"white"}}>
            <View style={{height:"20%"}}>
                <StatusBar barStyle="dark-content"/>
                <View style={{height:"30%"}}></View>
                <View style={{flexDirection:'row', justifyContent:"space-between", height:"40%", padding:10}}>
                    <Text>Icon!</Text>
                    <SearchBar
                        inputContainerStyle={{height:"60%"}}
                        containerStyle={{backgroundColor:"white", width: "90%", height:"70%"}}
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