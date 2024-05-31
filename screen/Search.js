import React, {useEffect, useState} from 'react';
import {FlatList, Image, StyleSheet, View} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {ActivityIndicator, Text, TextInput} from 'react-native-paper';

export default function Search({navigation}) {
  const [keyword, setKeyword] = useState('');
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(true);
  const [numColumns, setNumColumns] = useState(3);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const searchMovies = async searchText => {
    try {
      const response = await fetch(
        `https://phimapi.com/v1/api/tim-kiem?keyword=${searchText}`,
      );
      const responseData = await response.json();
      setSearchResult(responseData.data.items);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (keyword.trim() !== '') {
      searchMovies(keyword);
    } else {
      setSearchResult([]);
    }
  }, [keyword]);

  const refreshList = () => {
    setIsRefreshing(true);
  };

  const renderItem = ({item}) => {
    const truncatedName =
      item.name.length > 15 ? `${item.name.substring(0, 10)}...` : item.name;
    return (
      <TouchableOpacity
        onPress={() => navigation.navigate('FilmDetail', {slug: item.slug})}
        style={{
          marginBottom: 5,
          flex: 1,
          alignItems: 'center',
        }}
        activeOpacity={1}>
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

  return (
    <View style={styles.container}>
      <View style={styles.viewTxt}>
        <TextInput
          textColor="#000"
          text
          style={{
            flex: 1,
            backgroundColor: '#dcdcdc',
            borderTopLeftRadius: 50,
            borderTopRightRadius: 50,
            borderBottomLeftRadius: 50,
            borderBottomRightRadius: 50,
          }}
          label={'Nhập phim muốn tìm'}
          value={keyword}
          onChangeText={setKeyword}
        />
      </View>
      <FlatList
        contentContainerStyle={styles.flatListContainer}
        data={searchResult}
        numColumns={numColumns}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
        onEndReachedThreshold={0.5}
        refreshing={isRefreshing}
        onRefresh={refreshList}
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
  viewTxt: {
    height: 60,
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
    marginTop: 10,
  },
  poster: {
    // marginBottom: 10,
    resizeMode: 'center',
    height: 150,
    width: 130,
    borderRadius: 10,
  },
  txt: {
    marginLeft: 5,
    fontWeight: 'bold',
    fontSize: 15,
    color: 'white',
    marginTop: 3,
    marginBottom: 10,
  },
});
