import React from 'react';
import { View, StatusBar } from 'react-native';
import { Header } from 'react-native-elements';

export function PageHeader(props) {
    return (
        <View>
            <StatusBar barStyle='dark-content' />
            <Header
                leftContainerStyle={{flex:3.3333}}
                centerContainerStyle={{flex:3.3333}}
                rightContainerStyle={{ flex:3.3333}}
                containerStyle={{
                    backgroundColor: 'white',
                    justifyContent: 'space-between',
                }}
                leftComponent={props?.leftComp} 
                centerComponent={props?.centerComp}
                rightComponent={props?.rightComp}    
            />
        </View>
    );
}