import {useState} from 'react';
import {Alert, Image, Text, TouchableOpacity, View} from 'react-native';
import {Button, TextInput} from 'react-native-paper';
import {createAccount} from '../store/index';

export default function Register({navigation}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [cpassword, setCPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPass, setShowPass] = useState(false);
  const handleCreateAccount = () => {
    if (!email.match(/.+@.+/)) {
      Alert.alert('Email không đúng định dạng!');
    } else if (fullName == '') Alert.alert('Full Name không được bỏ trống!');
    else if (password.length < 6) {
      Alert.alert('Password không được ít hơn 6 ký tự!');
    } else if (password != cpassword) {
      Alert.alert('Password và Confirm Password không giống nhau!');
    } else createAccount(email, password, fullName);
    navigation.goBack();
  };
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        padding: 20,
        backgroundColor: '#000',
      }}>
      {/* <Image
        // resizeMode="contain"
        source={require("./images/LogoWG_nobg.png")}
        style={{
          alignSelf: "center",
          flex: 1,
          aspectRatio: 1,
          height: undefined,
          width: undefined,
        }}
      /> */}
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Text
          style={{
            color: '#98fb98',
            fontSize: 50,
            fontWeight: 'bold',
          }}>
          Register
        </Text>
      </View>
      <TextInput
        placeholder={'Full Name'}
        value={fullName}
        onChangeText={setFullName}
        style={{marginBottom: 20, backgroundColor: null}}
        underlineColor="white"
        textColor="#fff"
        placeholderTextColor={'white'}
      />
      <TextInput
        placeholder={'Email'}
        value={email}
        onChangeText={setEmail}
        style={{marginBottom: 20, backgroundColor: null}}
        underlineColor="white"
        textColor="#fff"
        placeholderTextColor={'white'}
      />
      <TextInput
        secureTextEntry={!showPass}
        placeholder={'Password'}
        value={password}
        onChangeText={setPassword}
        style={{marginBottom: 20, backgroundColor: null}}
        underlineColor="white"
        textColor="#fff"
        placeholderTextColor={'white'}
        right={
          <TextInput.Icon
            icon={showPass ? 'eye-off' : 'eye'}
            onPress={() => setShowPass(!showPass)}
          />
        }
      />
      <TextInput
        secureTextEntry={!showPass}
        placeholder={'Confirm Password'}
        value={cpassword}
        onChangeText={setCPassword}
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
        onPress={handleCreateAccount}
        textColor="#000"
        style={{marginTop: 5, padding: 5, backgroundColor: '#98fb98'}}>
        Create Account
      </Button>
      <View
        style={{
          flexDirection: 'row',
          marginBottom: 50,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Text style={{color: '#fff'}}>Already have an account? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={{color: 'red', fontWeight: 'bold'}}>Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
