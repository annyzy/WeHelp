import React, { Component } from 'react';
import { Button, View } from 'react-native';
import { styles } from './styles';


export class Login extends Component {
    render() {
        return (
            <View style={styles.randomStyle}>
                <Button onPress={this.props.onLoginPress}
                title="login"
                />
            </View>
        )
    }
}