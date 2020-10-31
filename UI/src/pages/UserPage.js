import React from 'react';
import { View, Text } from 'react-native';
import { PageHeader } from '../components/PageHeader';

export function UserPage() {
    return (
        <View style={{flex: 1, justifyContent: 'space-between', backgroundColor: 'white'}}>
            <PageHeader centerComp={<Text>User</Text>} />
            <View style={{alignItems: 'center'}}>
                <Text>text!</Text>
            </View>
            <View></View>
        </View>
    );
  }