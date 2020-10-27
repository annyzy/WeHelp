import React from 'react';
import { View, Text } from 'react-native';
import { SearchBar } from 'react-native-elements'
import { PageHeader } from './PageHeader'

export function HomePage() {
    var keyword;
    return (
        <View style={{flex: 1, justifyContent: "space-between"}}>
        <View>
            <PageHeader pageName='Home' />
            <SearchBar
                lightTheme={true}
                platform='default'
                round={true}
                cancelButtonProps={{disabled:false}}
                onChangeText = {keyword}
            />
        </View>
        <View style={{alignItems: "center"}}>
            <Text>text!</Text>
        </View>
        <View></View>
        </View>
    );
}