import React, {useEffect, useState} from 'react';
import {Alert, StyleSheet, View} from 'react-native';
import {Button, Text, TextInput} from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';
import {useMyContextProvider} from '../store/index';

export default function ChangeName({navigation}) {
  const [controller, dispatch] = useMyContextProvider();
  const {userLogin} = controller;
  const [fullName, setFullName] = useState('');
  const USERS = firestore().collection('USERS');

  useEffect(() => {
    if (userLogin == null) navigation.navigate('Login');
  }, [userLogin]);

  const handleChangeName = () => {
    USERS.doc(userLogin.email).update({fullname: fullName});
    navigation.navigate('Setting');
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#000',
        justifyContent: 'center',
        padding: 30,
      }}>
      <TextInput
        placeholder={'Tên người dùng'}
        value={fullName}
        onChangeText={setFullName}
        style={{marginBottom: 20, backgroundColor: null}}
        underlineColor="white"
        textColor="#fff"
        placeholderTextColor={'#fff'}
      />
      <Button
        textColor="#000"
        style={{marginTop: 5, padding: 5, backgroundColor: '#98fb98'}}
        mode="contained"
        onPress={handleChangeName}>
        Lưu tên người dùng
      </Button>
    </View>
  );
}
