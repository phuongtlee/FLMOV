import React from 'react';
import Favorites from '../screen/Favorites';
import History from '../screen/History';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
const Tab = createMaterialTopTabNavigator();

export default function () {
  return (
    <Tab.Navigator
      initialRouteName="Favorite"
      screenOptions={{
        tabBarStyle: {backgroundColor: '#000'},
      }}>
      <Tab.Screen
        name="Favorite"
        component={Favorites}
        options={{
          headerShown: false,
          tabBarLabel: 'Favorite',
          // tabBarIcon: () => <Icon source="heart" color="#fff" size={26} />,
          tabBarLabelStyle: {color: '#fff', fontSize: 13},
        }}
      />
      <Tab.Screen
        name="History"
        component={History}
        options={{
          headerShown: false,
          tabBarLabel: 'History',
          // tabBarIcon: () => <Icon source="heart" color="#fff" size={26} />,
          tabBarLabelStyle: {color: '#fff', fontSize: 13},
        }}
      />
    </Tab.Navigator>
  );
}
