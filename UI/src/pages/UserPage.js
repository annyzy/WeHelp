import React, { useContext } from 'react';
import { View, Text, Image } from 'react-native';
import { PageHeader } from '../components/PageHeader';
import { UserContext } from '../components/UserContext';

export function UserPage() {
    const user = useContext(UserContext);

    return (
        <View style={{flex: 1, justifyContent: 'space-between', backgroundColor: 'white'}}>
            <PageHeader centerComp={<Text>User</Text>} />
            <Image source={{
                uri: user.photoUrl
            }} style={{width:200, height:200, alignSelf:"center"}}/>
            <View style={{alignItems: 'center'}}>
                <Text>text!</Text>
            </View>
            <View></View>
        </View>
    );
}