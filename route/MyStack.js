import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import FilmDetail from '../screen/FilmDetail';
import PlayVideo from '../screen/PlayVideo';
import BottomTab from './BottomTab';
import Cartoon from '../screen/Cartoon';
import Cinema from '../screen/Cinema';
import TVseries from '../screen/TVseries';
import TVShow from '../screen/TVShow';
import NewFilm from '../screen/NewFilm';
import Register from '../screen/Register';
import Login from '../screen/Login';
import ChangePass from '../screen/ChangePass';
import ChangeName from '../screen/ChangeName';

const Stack = createStackNavigator();
const MyStack = ({navigation, route}) => {
  return (
    <Stack.Navigator
      initialRouteName="BottomTab"
      screenOptions={{
        headerStyle: {
          backgroundColor: '#000',
        },
        headerTintColor: '#fff',
      }}>
      <Stack.Screen
        name="FilmDetail"
        component={FilmDetail}
        options={{headerTitle: 'Thông tin phim', headerTintColor: '#fff'}}
      />
      <Stack.Screen
        name="BottomTab"
        component={BottomTab}
        options={{headerMode: 'none'}}
      />

      <Stack.Screen
        name="PlayVideo"
        component={PlayVideo}
        options={{headerTitle: 'Xem phim', headerTintColor: '#fff'}}
      />
      <Stack.Screen
        name="Cartoon"
        component={Cartoon}
        options={{headerTitle: 'Hoạt hình', headerTintColor: '#fff'}}
      />
      <Stack.Screen
        name="Cinema"
        component={Cinema}
        options={{headerTitle: 'Phim lẻ', headerTintColor: '#fff'}}
      />
      <Stack.Screen
        name="TVseries"
        component={TVseries}
        options={{headerTitle: 'Phim bộ', headerTintColor: '#fff'}}
      />
      <Stack.Screen
        name="TVShow"
        component={TVShow}
        options={{
          headerTitle: 'Chương trình truyền hình',
          headerTintColor: '#fff',
        }}
      />
      <Stack.Screen
        name="NewFilm"
        component={NewFilm}
        options={{headerTitle: 'Phim mới cập nhật', headerTintColor: '#fff'}}
      />
      <Stack.Screen
        name="Register"
        component={Register}
        options={{headerTitle: 'Đăng kí', headerTintColor: '#fff'}}
      />
      <Stack.Screen
        name="Login"
        component={Login}
        options={{headerTitle: 'Đăng nhập', headerTintColor: '#fff'}}
      />
      <Stack.Screen
        name="ChangePass"
        component={ChangePass}
        options={{headerTitle: 'Đổi mật khẩu', headerTintColor: '#fff'}}
      />
      <Stack.Screen
        name="ChangeName"
        component={ChangeName}
        options={{headerTitle: 'Đổi tên', headerTintColor: '#fff'}}
      />
    </Stack.Navigator>
  );
};

export default MyStack;
