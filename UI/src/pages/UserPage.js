import React, { Component } from 'react';
import { View, Text, Image } from 'react-native';
import { PageHeader } from '../components/PageHeader';
import { EventRegister } from 'react-native-event-listeners';

export class UserPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            icon: "no icon"
        }
    }
    
    //changeIcon() {
        //this.listener = EventRegister.addEventListener('iconChanged', (newIcon) => {
            //this.setState({
                //icon: newIcon,
            //})
        //})
    //}
    render() {
        return (
            <View style={{flex: 1, justifyContent: 'space-between', backgroundColor: 'white'}}>
                <PageHeader centerComp={<Text>User</Text>} />
                <Image source={{
                    uri:'https://i.pinimg.com/originals/0c/1c/a1/0c1ca1955e2b0c5469ba17da2b1b9b96.jpg'
                }}/>
                <View style={{alignItems: 'center'}}>
                    <Text>text!</Text>
                </View>
                <View></View>
            </View>
        );
    }
  }