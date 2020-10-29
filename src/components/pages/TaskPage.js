import React from 'react';
import { View, Text } from 'react-native';
import { PageHeader } from './PageHeader';

export function TaskPage() {
    return (
        <View style={{flex: 1, justifyContent: 'space-between', backgroundColor: 'white'}}>
            <PageHeader leftComp={<Text style={{fontSize:40}}>Task</Text>} />
            <View style={{alignItems: 'center'}}>
                <Text>text!</Text>
            </View>
            <View></View>
        </View>
    );
  }