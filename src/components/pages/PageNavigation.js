import React, {Component} from 'react'
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { HomePage } from './HomePage'
import { TaskPage } from './TaskPage'
import { PublishPage } from './PublishPage'
import { MessagePage } from './MessagePage'
import { UserPage } from './UserPage'

const Tab = createBottomTabNavigator();

export class PageNavigation extends Component {
    render() {
      return (
        <NavigationContainer>
          <Tab.Navigator>
            <Tab.Screen name="Home" component={HomePage} />
            <Tab.Screen name="Task" component={TaskPage} />
            <Tab.Screen name="Publish" component={PublishPage} />
            <Tab.Screen name="Message" component={MessagePage} />
            <Tab.Screen name="User" component={UserPage} />
          </Tab.Navigator>
        </NavigationContainer>
     );
    }
}