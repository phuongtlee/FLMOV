import React, {useEffect, useState} from 'react';
import {View, Alert} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';

import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  MyContextControllerProvider,
  useMyContextProvider,
} from '../store/index';
import MyStack from '../route/MyStack';

const MainApp = () => {
  const [controller, dispatch] = useMyContextProvider();
  const {userLogin} = controller;
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const checkUserLogin = async () => {
      try {
        // Lấy dữ liệu người dùng từ AsyncStorage
        const userString = await AsyncStorage.getItem('user');
        if (userString) {
          const user = JSON.parse(userString);

          dispatch({type: 'USER_LOGIN', value: user});
        } else {
        }
      } catch (error) {
        console.error('Error loading user data from AsyncStorage:', error);
      } finally {
        setInitializing(false);
      }
    };

    checkUserLogin();
  }, []);

  return (
    <NavigationContainer>
      <MyStack />
    </NavigationContainer>
  );
};

const AppFlmov = () => {
  return (
    <View style={{flex: 1}}>
      <MyContextControllerProvider>
        <MainApp />
      </MyContextControllerProvider>
    </View>
  );
};

export default AppFlmov;
