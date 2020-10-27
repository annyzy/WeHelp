import React from 'react';
import { Animated, View, Text, StyleSheet, Button, TextInput } from 'react-native';
import { PageHeader } from './PageHeader'

export function PublishPage({navigation}) {
    return (
        <View style={{flex: 1, justifyContent: "space-between"}}>
            <View>
                <PageHeader pageName="Publish" />
                <View style = {{ padding: 15}}>
                <TextInput clearButtonMode="always"
                    multiline={true}
                    numberOfLines={20}
                    style={{fontSize:20}}
                    autoFocus={true}
                    // value={"PlaceHolder"}
                />
            </View>
            </View>
        <Button title="Go back" onPress={() => navigation.goBack()} />
        <View></View>
        </View>
    );
  }