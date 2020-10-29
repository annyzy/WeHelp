import React from 'react';
import { View, Text } from 'react-native';
import { PageHeader } from './PageHeader';

export function MessagePage() {
    return (
        <View style={{flex: 1, justifyContent: 'space-between', backgroundColor: 'white'}}>
        <PageHeader centerComp={<Text>Message</Text>} />
        <View style={{alignItems: 'center'}}>
            <Text>text!</Text>
        </View>
        <View></View>
        </View>
    );
}