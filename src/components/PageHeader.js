import React from 'react';
import { View, StatusBar } from 'react-native';
import { Header } from 'react-native-elements';

export function PageHeader(props) {
    return (
        <View>
            <StatusBar barStyle='dark-content' />
            <Header
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