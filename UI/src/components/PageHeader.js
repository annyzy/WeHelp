import React, { Component } from 'react';
import { View, StatusBar } from 'react-native';
import { Header } from 'react-native-elements';

/**
 *
 * A customized page header is used across most of the pages in this application.
 *
 * @export
 * @param {{leftComp: Component, centerComp: Component, rightComp:Component}} props <br>
 * 1. props.leftComp
 * 2. props.centerComp
 * 3. props.rightComp
 * @return {Component} => Render a PageHeader Component with leftComp, centerComp, rightComp if applicable
 */
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