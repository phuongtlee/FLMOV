import React, {useEffect, useState} from 'react';
import {Alert, Text, TouchableOpacity, View} from 'react-native';
import {Button, TextInput} from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {login, useMyContextProvider} from '../store/index';

export default function Login({navigation}) {
  const [controller, dispatch] = useMyContextProvider();
  const {userLogin} = controller;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);

  useEffect(() => {
    if (userLogin != null) navigation.navigate('Home');
  }, [userLogin]);

  const handleLogin = async () => {
    if (email === '') {
      Alert.alert('Email không được bỏ trống!');
    } else if (password === '') {
      Alert.alert('Password không được bỏ trống!');
    } else {
      login(dispatch, email, password);
    }
  };

  // const saveLoggedInUser = async (dispatch, email, password) => {
  //   try {
  //     await AsyncStorage.setItem('loggedInUser', dispatch, email, password);
  //   } catch (error) {
  //     console.error('Error saving logged in user:', error);
  //   }
  // };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        padding: 20,
        backgroundColor: '#000',
      }}>
      <View style={{justifyContent: 'center', alignItems: 'center'}}>
        <Text style={{color: '#98fb98', fontSize: 50, fontWeight: 'bold'}}>
          LOGIN
        </Text>
      </View>
      <TextInput
        placeholder={'Email'}
        value={email}
        onChangeText={setEmail}
        style={{marginBottom: 20, backgroundColor: null}}
        underlineColor="white"
        textColor="#fff"
        placeholderTextColor={'#fff'}
      />
      <TextInput
        placeholder={'Password'}
        value={password}
        secureTextEntry={!showPass}
        onChangeText={setPassword}
        style={{marginBottom: 20, backgroundColor: null}}
        underlineColor="white"
        textColor="#fff"
        placeholderTextColor={'#fff'}
        right={
          <TextInput.Icon
            icon={showPass ? 'eye-off' : 'eye'}
            onPress={() => setShowPass(!showPass)}
          />
        }
      />
      <Button
        mode="contained"
        onPress={handleLogin}
        textColor="#000"
        style={{marginTop: 5, padding: 5, backgroundColor: '#98fb98'}}>
        Login
      </Button>
      <View
        style={{
          flexDirection: 'row',
          marginBottom: 100,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Text style={{color: '#fff'}}>Don't have an account? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
          <Text style={{color: 'red', fontWeight: 'bold'}}>Sign up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
