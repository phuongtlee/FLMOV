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
// import {ScrollView} from 'react-native-gesture-handler';
import {Button} from 'react-native-paper';

export default function TVseries({navigation}) {
  const [page, setPage] = useState(1);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [numColumns, setNumColumns] = useState(3);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchApi = async pageNumber => {
    try {
      const response = await fetch(
        `https://phimapi.com/v1/api/danh-sach/phim-bo?page=${pageNumber}`,
      );
      const json = await response.json();
      if (json.status === 'success') {
        setData(prevData =>
          pageNumber === 1
            ? json.data.items
            : [...prevData, ...json.data.items],
        );
      } else {
        console.error('Failed to fetch data:', json.msg);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
      setIsRefreshing(false); // Set refreshing state to false
    }
  };

  useEffect(() => {
    fetchApi(page);
  }, [page]);

  const loadMore = () => {
    setPage(prevPage => prevPage + 1);
  };

  const refreshList = () => {
    setIsRefreshing(true);
    setPage(1);
  };
  const renderItem = ({item}) => {
    const truncatedName =
      item.name.length > 20 ? `${item.name.substring(0, 26)}...` : item.name;
    return (
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => navigation.navigate('FilmDetail', {slug: item.slug})}
        style={{
          marginBottom: 5,
          flex: 1,
          alignItems: 'center',
        }}>
        <Image
          source={{
            uri: `https://img.phimapi.com/${item.poster_url}`,
          }}
          style={styles.poster}
        />
        {/* <Text>{item.time}</Text> */}
        <Text style={styles.txt}>{truncatedName}</Text>
      </TouchableOpacity>
    );
  };

  if (loading && page === 1) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator animating={true} color={'#000'} />
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
          loading && page > 1 ? (
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
  title: {
    fontSize: 20,
    marginBottom: 10,
    textAlign: 'center',
  },
  flatListContainer: {
    // flex: 1,
    marginTop: 5,
  },
  poster: {
    // marginBottom: 10,
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
  },
});
