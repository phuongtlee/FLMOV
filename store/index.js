import {createContext, useContext, useMemo, useReducer} from 'react';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import {Alert} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const MyContext = createContext();
const reducer = (state, action) => {
  switch (action.type) {
    case 'USER_LOGIN': {
      return {...state, userLogin: action.value};
    }
    case 'USER_LOGOUT': {
      return {...state, userLogin: null};
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
};

const MyContextControllerProvider = ({children}) => {
  const initialState = {
    userLogin: null,
  };
  const [controller, dispatch] = useReducer(reducer, initialState);
  const value = useMemo(() => [controller, dispatch]);
  return <MyContext.Provider value={value}>{children}</MyContext.Provider>;
};
const useMyContextProvider = () => {
  const context = useContext(MyContext);
  if (!context) {
    throw new Error(
      'useMyContextController phai dat trong MyContextControllerProvider',
    );
  }
  return context;
};

const USERS = firestore().collection('USERS');
const FAVORITES = firestore().collection('FAVORITES');
const HISTORY = firestore().collection('HISTORY');
const EPHISTORY = firestore().collection('EPHISTORY');

const createAccount = (
  email,
  password,
  fullname,
  /*, phone, role*/
) => {
  auth()
    .createUserWithEmailAndPassword(email, password)
    .then(() => {
      Alert.alert('Create account success with ' + email);
      USERS.doc(email).set({
        email,
        password,
        fullname,
        /* phone,
        role,*/
      });
    })
    .catch(e => console.log(e.message));
};

const login = (dispatch, email, password) => {
  auth()
    .signInWithEmailAndPassword(email, password)
    .then(() => {
      USERS.doc(email).onSnapshot(async u => {
        if (u.exists) {
          Alert.alert('Login success with ' + u.id);
          const userData = u.data();
          await AsyncStorage.setItem('user', JSON.stringify(userData));
          console.log(userData);
          dispatch({type: 'USER_LOGIN', value: userData});
        }
      });
    })
    .catch(e => Alert.alert('Wrong email or password'));
};

const logout = async dispatch => {
  try {
    console.log('Logging out...');

    // Đăng xuất từ Firebase Authentication trước
    await auth().signOut();
    console.log('User signed out successfully.');

    // Xóa dữ liệu người dùng từ AsyncStorage
    await AsyncStorage.removeItem('user');
    console.log('User data removed from AsyncStorage successfully.');

    // Cập nhật trạng thái đăng nhập của ứng dụng
    dispatch({type: 'USER_LOGOUT'});
  } catch (error) {
    console.error('Error logging out:', error);
  }
};

// const logout = async dispatch => {
//   auth()
//     .signOut()
//     .then(() => dispatch({type: 'USER_LOGOUT'}));
// };

const addFav = (userid, slug_film, name_film, poster_url) => {
  FAVORITES.doc(userid + '_' + slug_film)
    .set({
      userid: userid,
      slug: slug_film,
      name: name_film,
      poster_url: poster_url,
    })
    .then(() => {
      console.log('Thêm phim vào danh sách yêu thích thành công');
    })
    .catch(e => console.log(e.message));
};
const addHis = (userid, slug_film, name_film, poster_url, slug_tap) => {
  const currentTime = firestore.Timestamp.now();
  HISTORY.doc(userid + '_' + slug_film)
    .set({
      userid: userid,
      slug: slug_film,
      name: name_film,
      poster_url: poster_url,
      slug_tap: slug_tap,
      datetime: currentTime,
    })
    .then(() => {
      console.log('Lưu phim vào danh sách lịch sử thành công');
    })
    .catch(e => console.log(e.message));
  EPHISTORY.doc(userid + '_' + slug_film + '_' + slug_tap)
    .set({
      userid: userid,
      slug: slug_film,
      slug_tap: slug_tap,
    })
    .then(() => {
      console.log('Lưu tập phim vào danh sách lịch sử thành công');
    })
    .catch(e => console.log(e.message));
};

const updateHis = (userid, slug_film, slug_tap) => {
  const currentTime = firestore.Timestamp.now();
  HISTORY.doc(userid + '_' + slug_film)
    .update({slug_tap: slug_tap, datetime: currentTime})
    .then(() => {
      console.log('Lưu tập phim vào danh sách lịch sử thành công' + slug_tap);
    })
    .catch(e => console.log(e.message));
  EPHISTORY.doc(userid + '_' + slug_film + '_' + slug_tap).onSnapshot(
    response => {
      const data = response.data();
      console.log(data);
      if (data == null) {
        EPHISTORY.doc(userid + '_' + slug_film + '_' + slug_tap)
          .set({
            userid: userid,
            slug: slug_film,
            slug_tap: slug_tap,
          })
          .then(() => {
            console.log('Lưu tập phim vào danh sách lịch sử thành công');
          })
          .catch(e => console.log(e.message));
      }
    },
  );
};
const checkEPHis = async (userid, slug_film, slug_tap) => {
  try {
    const doc = await EPHISTORY.doc(
      userid + '_' + slug_film + '_' + slug_tap,
    ).get();
    return doc.exists;
  } catch (error) {
    console.error('Error checking episode history:', error);
    return false;
  }
};
const delFav = docid => {
  FAVORITES.doc(docid).delete();
};
export {
  MyContextControllerProvider,
  useMyContextProvider,
  login,
  logout,
  createAccount,
  addFav,
  delFav,
  addHis,
  updateHis,
  checkEPHis,
};
