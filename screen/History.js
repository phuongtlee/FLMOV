import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
} from 'react-native';
import {Button} from 'react-native-paper';
import {useMyContextProvider} from '../store/index';
import firestore from '@react-native-firebase/firestore';

export default function History({navigation}) {
  const [controller] = useMyContextProvider();
  const {userLogin} = controller;
  const [page, setPage] = useState(1);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [numColumns, setNumColumns] = useState(3);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const HISTORY = firestore().collection('HISTORY');

  useEffect(() => {
    if (!userLogin) {
      setLoading(false);
      return;
    }

    const unsubscribe = HISTORY.where('userid', '==', userLogin.email)
      .orderBy('datetime', 'desc')
      .onSnapshot(
        response => {
          if (response && !response.empty) {
            const arr = [];
            response.forEach(doc => arr.push(doc.data()));
            setData(arr);
          } else {
            setData([]);
          }
          console.log(data);
          setLoading(false);
          setIsRefreshing(false);
        },
        error => {
          console.error('Error fetching data:', error);
          setLoading(false);
          setIsRefreshing(false);
        },
      );

    return () => unsubscribe && unsubscribe();
  }, [userLogin]);

  const loadMore = () => {
    setPage(prevPage => prevPage + 1);
  };

  const refreshList = () => {
    setIsRefreshing(true);
    setPage(1);
    if (userLogin) {
      HISTORY.where('userid', '==', userLogin.email)
        .orderBy('datetime', 'desc')
        .onSnapshot(
          response => {
            if (response && !response.empty) {
              const arr = [];
              response.forEach(doc => arr.push(doc.data()));
              setData(arr);
            } else {
              setData([]);
            }
            setIsRefreshing(false);
          },
          error => {
            console.error('Error fetching data:', error);
            setIsRefreshing(false);
          },
        );
    }
  };

  const renderItem = ({item}) => {
    const truncatedName =
      item.name.length > 20 ? `${item.name.substring(0, 20)}...` : item.name;
    return (
      <TouchableOpacity
        onPress={() => navigation.navigate('FilmDetail', {slug: item.slug})}
        style={styles.itemContainer}>
        <Image source={{uri: item.poster_url}} style={styles.poster} />
        <Text style={styles.txt}>{truncatedName}</Text>
      </TouchableOpacity>
    );
  };

  if (loading && data.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator animating={true} color={'#fff'} />
      </View>
    );
  }

  if (!loading && data.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.txt}>No history found.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        contentContainerStyle={styles.flatListContainer}
        data={data}
        numColumns={numColumns}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        refreshing={isRefreshing}
        onRefresh={refreshList}
        ListFooterComponent={
          loading && data.length > 0 ? (
            <ActivityIndicator size="large" color="#0000ff" />
          ) : null
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    padding: 5,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  flatListContainer: {
    // flex: 1,
    marginTop: 5,
  },
  poster: {
    resizeMode: 'center',
    height: 150,
    width: 150,
    borderRadius: 10,
  },
  txt: {
    marginLeft: 5,
    fontWeight: 'bold',
    fontSize: 15,
    color: 'white',
    textAlign: 'center', // Ensure text is centered
  },
  itemContainer: {
    marginBottom: 5,
    flex: 1,
    alignItems: 'center',
  },
});
