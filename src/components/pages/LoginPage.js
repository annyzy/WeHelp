import React, { Component} from "react";
import { Button, View } from "react-native";
import { PageHeader } from "./PageHeader"
import * as Google from 'expo-google-app-auth'

export class LoginPage extends Component {
    constructor(props) {
        super(props);
    }

    signIn = async () => {
        try {
          const result = await Google.logInAsync({
            androidClientId:
                      "916471448464-s7gervtibhhm4749f6bfe5kv91vqo30f.apps.googleusercontent.com",
            iosClientId: 
                      "916471448464-0ar23dtivdilvgpro4fkq3f126js8rh3.apps.googleusercontent.com",
            scopes: ["profile", "email"]
          })
    
          if (result.type === "success") {
              this.props.setUser(result.user.name, result.user.photoUrl);
          } else {
            console.log("cancelled")
          }
        } catch (e) {
          console.log("error", e)
        }
    }

    render() {
        return (
            <View style={ {flex:1, justifyContent: "space-between"} }>
                <PageHeader pageName="Login Page" />
                <Button title="Sign in with Google" onPress={this.signIn}/>
                <View></View>
            </View>
        )
    }
}