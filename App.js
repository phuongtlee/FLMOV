import React from 'react';
import {View} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import MyStack from './route/MyStack';
import {MyContextControllerProvider} from './store';
import AppFlmov from './screen/AppFlmov';

export default function App() {
  return (
    <View style={{flex: 1}}>
      {/* <MyContextControllerProvider>
        <NavigationContainer>
          <MyStack />
        </NavigationContainer>
      </MyContextControllerProvider> */}
      <AppFlmov />
    </View>
  );
}
