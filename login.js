import { GoogleSignin, GoogleSigninButton } from '@react-native-community/google-signin';
import React, { Component } from 'react';
import { Button, View } from 'react-native';
import { styles } from './styles';


export class Login extends Component {
    render() {
        return (
            <GoogleSigninButton
            onPress={this.props.onLoginPress}
            size={GoogleSigninButton.Size.Wide}
            color={GoogleSigninButton.Color.Dark}
            style={{width:100, height:100}}
            />
        )
    }
}