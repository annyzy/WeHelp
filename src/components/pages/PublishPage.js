import React from 'react';
import { Animated, View, Text, StyleSheet, Button, TextInput } from 'react-native';
import { PageHeader } from './PageHeader'

export function PublishPage({navigation}) {
    return (
        <View style={{flex: 1, justifyContent: "flex-start", backgroundColor: "white"}}>
            <PageHeader 
                leftComp={<Button title="Back" onPress={() => navigation.goBack()} />}
                rightComp={<Button title="Publish" onPress={() => navigation.goBack()} />}/>
            <View style = {{ padding: 15}}>
                <TextInput clearButtonMode="always"
                    multiline={true}
                    numberOfLines={20}
                    style={{fontSize:20}}
                    autoFocus={true}
                />
            </View>
            <View></View>
        </View>
    );
  }