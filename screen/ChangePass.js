import React, {useEffect, useState} from 'react';
import {Alert, StyleSheet, View} from 'react-native';
import {Button, Text, TextInput} from 'react-native-paper';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {useMyContextProvider} from '../store/index';

export default function ChangePass({navigation}) {
  const [controller, dispatch] = useMyContextProvider();
  const {userLogin} = controller;
  const [curenPassword, setCurenPassword] = useState('');
  const [newPassword, setNewPassWord] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (userLogin == null) navigation.navigate('Login');
  }, [userLogin]);

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const reauthenticate = curenPassword => {
    var user = auth().currentUser;
    var cred = auth.EmailAuthProvider.credential(user.email, curenPassword);
    return user.reauthenticateWithCredential(cred);
  };

  const handleChangePassword = () => {
    if (newPassword !== confirmNewPassword) {
      Alert.alert('Don not match password');
      return;
    }

    reauthenticate(curenPassword)
      .then(() => {
        var user = auth().currentUser;
        user
          .updatePassword(newPassword)
          .then(() => {
            firestore()
              .collection('USERS')
              .doc(userLogin.email)
              .update({password: newPassword});
            // Alert.alert('Change password susscced');
          })
          .catch(e => console.log(e.message));
      })
      .catch(e => console.log(e.message));
    navigation.navigate('Setting');
  };
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#000',
        padding: 30,
      }}>
      <TextInput
        secureTextEntry={!showPassword}
        placeholder={'Mật khẩu hiện tại'}
        value={curenPassword}
        onChangeText={setCurenPassword}
        style={{marginBottom: 20, backgroundColor: null}}
        underlineColor="white"
        textColor="#fff"
        placeholderTextColor={'#fff'}
      />
      <TextInput
        secureTextEntry={!showPassword}
        placeholder={'Mật khẩu mới'}
        value={newPassword}
        onChangeText={setNewPassWord}
        style={{marginBottom: 20, backgroundColor: null}}
        underlineColor="white"
        textColor="#fff"
        placeholderTextColor={'#fff'}
      />
      <TextInput
        secureTextEntry={!showPassword}
        placeholder={'Nhập lại mật khẩu mới'}
        value={confirmNewPassword}
        onChangeText={setConfirmNewPassword}
        style={{marginBottom: 20, backgroundColor: null}}
        underlineColor="white"
        textColor="#fff"
        placeholderTextColor={'#fff'}
      />
      <Button textColor="red" onPress={toggleShowPassword}>
        {showPassword ? 'Hide Password' : 'Show Password'}
      </Button>
      <Button
        textColor="#000"
        style={{marginTop: 5, padding: 5, backgroundColor: '#98fb98'}}
        mode="contained"
        onPress={handleChangePassword}>
        Đổi mật khẩu
      </Button>
    </View>
  );
}
