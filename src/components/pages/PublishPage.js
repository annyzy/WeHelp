import React from 'react';
import { View, Text } from 'react-native';
import { PageHeader } from './PageHeader'

export function PublishPage() {
    return (
        <View style={{flex: 1, justifyContent: "space-between"}}>
        <View>
            <PageHeader pageName="Publish" />
        </View>
        <View style={{alignItems: "center"}}>
            <Text>text!</Text>
        </View>
        <View></View>
        </View>
    );
  }