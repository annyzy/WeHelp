import React from 'react';
import { StyleSheet, StatusBar, View, Text } from 'react-native';
import { Header, SearchBar, Divider } from 'react-native-elements'
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

function HomeScreen() {
  return (
    <View style={ {x:0, y:0}}>
      <StatusBar barStyle='default' />
      <Header 
        centerComponent={{text: 'Home', style: {fontSize:24, fontWeight:"bold"}}}
      />
      <SearchBar lightTheme="true" platform='default' round='true' cancelButtonProps={{disabled:"falese"}}/>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
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

export default function App() {
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

// export default function App() {
//   return (
//     <View style={ {x:0, y:0}}>
//       <StatusBar barStyle='default' />
//       <Header 
//         centerComponent={{text: 'WeHelp', style: {fontSize:24, fontWeight:"bold"}}}
//       />
//       <SearchBar lightTheme="true" platform='default' round='true' cancelButtonProps={{disabled:"falese"}}/>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
// });
