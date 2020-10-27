import React, { Component } from 'react';
import { Platform } from 'react-native';
import { PageNavigation } from './src/components/pages/PageNavigation'
import { LoginPage } from './src/components/pages/LoginPage';

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
    if (this.state.signedIn || Platform.OS == 'web') {
      alert("hello " + this.state.name);
      return <PageNavigation/>;
    }
    else {
      return <LoginPage setUser={this.setUser} />;
    }
  }
}
