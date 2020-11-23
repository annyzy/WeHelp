import React from 'react';
import { View, Text } from 'react-native';
import { PageHeader } from '../components/PageHeader';

export function TaskDetailPage(props) {
  const {user} = props.route.params;

    return (
        <View style={{flex: 1, justifyContent: 'space-between', backgroundColor: 'white'}}>
            <PageHeader centerComp={<Text style={{fontSize:20}}>{user.name}</Text>} />
            <Text style={{alignSelf:'center'}}>text!</Text>
            <View></View>
        </View>
    );
}