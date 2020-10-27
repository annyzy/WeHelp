import React from 'react';
import { View, Text } from 'react-native';
import { PageHeader } from './PageHeader'

export function MessagePage() {
    return (
        <View style={{flex: 1, justifyContent: "space-between"}}>
        <View>
            <PageHeader pageName="Message" />
        </View>
        <View style={{alignItems: "center"}}>
            <Text>text!</Text>
        </View>
        <View></View>
        </View>
    );
}