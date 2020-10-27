import React from 'react';
import { Animated, View, Text, StyleSheet, Button } from 'react-native';
import { PageHeader } from './PageHeader'

export function PublishPage({navigation}) {
    return (
        <View style={{flex: 1, justifyContent: "space-between"}}>
            <View>
                <PageHeader pageName="Publish" />
            </View>
            <View style={{alignItems: "center"}}>
                <Text>text!</Text>
            </View>
        <Button title="Go back" onPress={() => navigation.goBack()} />
        </View>
    );
  }