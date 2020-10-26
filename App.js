import React, { Component } from 'react';
import { StyleSheet, StatusBar, View, Text, Button } from 'react-native';
import { Header, SearchBar, Divider } from 'react-native-elements'
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaView } from 'react-navigation';
//import { GoogleSignin, GoogleSigninButton } from '@react-native-community/google-signin'
import * as Google from 'expo-google-app-auth'


import { styles } from './styles';
import { LoginPage } from './LoginPage';


function HomeScreen() {
    var keyword;
  return (
    <View>
      <StatusBar barStyle='default' />
      <Header
        centerComponent={{text: 'Home', style: {fontSize:24, fontWeight:"bold"}}}
      />
      <SearchBar
      lightTheme="true"
      platform='default'
      round='true'
      cancelButtonProps={{disabled:"false"}}
      onChangeText = {keyword}
      />
      <View style={styles.randomStyle}>
        <Text>text!</Text>
      </View>
    </View>
  );
}


function TaskScreen() {
  return (
    <View style={ {x:0, y:0}}>
      <StatusBar barStyle='default' />
      <Header
        centerComponent={{text: 'Task', style: {fontSize:24, fontWeight:"bold"}}}
      />
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>text!</Text>
      </View>
    </View>
  );
}

function PublishScreen() {
  return (
    <View style={ {x:0, y:0}}>
      <StatusBar barStyle='default' />
      <Header
        centerComponent={{text: 'Publish', style: {fontSize:24, fontWeight:"bold"}}}
      />
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Text!</Text>
      </View>
    </View>
  );
}

function MessageScreen() {
  return (
    <View style={ {x:0, y:0}}>
      <StatusBar barStyle='default' />
      <Header
        centerComponent={{text: 'Message', style: {fontSize:24, fontWeight:"bold"}}}
      />
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Text!</Text>
      </View>
    </View>
  );
}

function UserScreen() {
  return (
    <View style={ {x:0, y:0}}>
      <StatusBar barStyle='default' />
      <Header
        centerComponent={{text: 'User', style: {fontSize:24, fontWeight:"bold"}}}
      />
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Text!</Text>
      </View>
    </View>
  );
}

const Tab = createBottomTabNavigator();

export default class App extends Component {
  constructor(props){
    super(props);
    this.setUser = this.setUser.bind(this);
    this.state = {
      signedIn: false,
      name: "no name",
      photoUrl: ""
    }
  }

  setUser(_name, _photoUrl) {
    this.setState({
      signedIn: true,
      name: _name,
      photoUrl: _photoUrl
    })
  }

  render() {
    if (this.state.signedIn) {
      alert("hello " + this.state.name);
      return <AfterLogin/>;
    }
    else {
      return <LoginPage setUser={this.setUser} />;
    }
  }
}


export class AfterLogin extends Component {
  render() {
    return (
      <NavigationContainer>
        <Tab.Navigator>
          <Tab.Screen name="Home" component={HomeScreen} />
          <Tab.Screen name="Task" component={TaskScreen} />
          <Tab.Screen name="Publish" component={PublishScreen} />
          <Tab.Screen name="Message" component={MessageScreen} />
          <Tab.Screen name="User" component={UserScreen} />
        </Tab.Navigator>
      </NavigationContainer>
   );
  }
}
