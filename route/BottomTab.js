import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import React from 'react';
import Home from '../screen/Home';
import Search from '../screen/Search';
import Setting from '../screen/Setting';
import {Icon} from 'react-native-paper';
import Login from '../screen/Login';
import Favorites from '../screen/Favorites';
import History from '../screen/History';
import TopTab from './TopTab';
import {useMyContextProvider} from '../store/index';
const Tab = createBottomTabNavigator();

export default function () {
  const [controller, dispatch] = useMyContextProvider();
  const {userLogin} = controller;
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        tabBarStyle: {backgroundColor: '#000'},
      }}>
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          headerShown: false,
          tabBarLabel: 'Home',
          tabBarIcon: () => <Icon source="home" color="#fff" size={26} />,
          tabBarLabelStyle: {color: '#fff', fontSize: 13},
        }}
      />
      <Tab.Screen
        name="Search"
        component={Search}
        options={{
          headerShown: false,
          tabBarLabel: 'Search',
          tabBarIcon: () => <Icon source="magnify" color="#fff" size={26} />,
          tabBarLabelStyle: {color: '#fff', fontSize: 13},
        }}
      />
      {userLogin != null ? (
        <Tab.Screen
          name="Favorite"
          component={TopTab}
          options={{
            headerShown: false,
            tabBarLabel: 'Favorite',
            tabBarIcon: () => <Icon source="heart" color="#fff" size={26} />,
            tabBarLabelStyle: {color: '#fff', fontSize: 13},
          }}
        />
      ) : (
        <Tab.Screen
          name="Favorite"
          component={Login}
          options={{
            headerShown: false,
            tabBarLabel: 'Favorite',
            tabBarIcon: () => <Icon source="heart" color="#fff" size={26} />,
            tabBarLabelStyle: {color: '#fff', fontSize: 13},
          }}
        />
      )}

      <Tab.Screen
        name="Setting"
        component={Setting}
        options={{
          headerShown: false,
          tabBarLabel: 'Setting',
          tabBarIcon: () => <Icon source="cog" color="#fff" size={26} />,
          tabBarLabelStyle: {color: '#fff', fontSize: 13},
        }}
      />
    </Tab.Navigator>
  );
}
