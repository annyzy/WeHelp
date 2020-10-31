import React, {Component} from 'react';
import { View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { HomePage } from '../pages/HomePage';
import { TaskPage } from '../pages/TaskPage';
import { PublishPage } from '../pages/PublishPage';
import { MessagePage } from '../pages/MessagePage';
import { UserPage } from '../pages/UserPage';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

export class PageNavigation extends Component {
  render() {
    return (
      <NavigationContainer>
        <Stack.Navigator headerMode='false' mode='modal'> 
          <Stack.Screen name='Main' component={TabNavigator}/>
          <Stack.Screen name='Publish' component={PublishPage}/>
        </Stack.Navigator>
      </NavigationContainer>
   );
  }
}

function TabNavigator({ navigation }) {
  return (
    <Tab.Navigator initialRouteName='Home'>
      <Tab.Screen name='Home' component={HomePage} />
      <Tab.Screen name='Task' component={TaskPage} />
      <Tab.Screen name='Publish' component={ModalPlaceHolder} 
      listeners={() => ({
        tabPress: e => {
          e.preventDefault();
          navigation.navigate('Publish');
        },
      })}/>
      <Tab.Screen name='Message' component={MessagePage} />
      <Tab.Screen name='User' component={UserPage} />
    </Tab.Navigator>
  );
}

function ModalPlaceHolder() {
  return (
    <View/> 
  );
}