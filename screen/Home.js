import React, {useEffect, useState} from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
  ScrollView,
} from 'react-native';
import {ActivityIndicator, Button, Text} from 'react-native-paper';
import Slideshow from 'react-native-image-slider-show';

export default function Home({navigation}) {
  const [page, setPage] = useState(1);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [numColumns, setNumColumns] = useState(3);
  const [dataSlide, setDataSlide] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dataCinema, setDataCinema] = useState([]);
  const [dataTVseries, setDataTVseries] = useState([]);
  const [dataTVshow, setDataTVshow] = useState([]);
  const [dataCartoon, setDataCartoon] = useState([]);

  const fetchApi = async pageNumber => {
    try {
      const response = await fetch(
        `https://phimapi.com/danh-sach/phim-moi-cap-nhat?page=${pageNumber}`,
      );
      const json = await response.json();
      setData(json.items.slice(0, 6));
      setDataSlide(
        json.items.slice(0, 5).map(item => ({
          url: item.thumb_url,
          title: item.name,
          slug: item.slug,
        })),
      );
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchApiCinema = async pageNumber => {
    try {
      const response = await fetch(
        `https://phimapi.com/v1/api/danh-sach/phim-le?page=${pageNumber}`,
      );
      const json = await response.json();
      setDataCinema(json.data.items.slice(0, 6));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchApiTVseries = async pageNumber => {
    try {
      const response = await fetch(
        `https://phimapi.com/v1/api/danh-sach/phim-bo?page=${pageNumber}`,
      );
      const json = await response.json();
      setDataTVseries(json.data.items.slice(0, 6));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchApiTVShow = async pageNumber => {
    try {
      const response = await fetch(
        `https://phimapi.com/v1/api/danh-sach/tv-shows?page=${pageNumber}`,
      );
      const json = await response.json();
      setDataTVshow(json.data.items.slice(0, 6));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchApiCartoon = async pageNumber => {
    try {
      const response = await fetch(
        `https://phimapi.com/v1/api/danh-sach/hoat-hinh?page=${pageNumber}`,
      );
      const json = await response.json();
      setDataCartoon(json.data.items.slice(0, 6));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApi(page);
    fetchApiCinema(page);
    fetchApiCartoon(page);
    fetchApiTVShow(page);
    fetchApiTVseries(page);
  }, [page]);

  const handleSlideChange = index => {
    setCurrentIndex(index);
  };

  const renderItem = ({item}) => {
    const truncatedName =
      item.name.length > 20 ? `${item.name.substring(0, 20)}...` : item.name;
    return (
      <TouchableOpacity
        activeOpacity={1}
        style={{
          marginBottom: 5,
          flex: 1,
          alignItems: 'center',
          marginRight: 5,
        }}
        onPress={() => navigation.navigate('FilmDetail', {slug: item.slug})}>
        <View
          style={{
            alignItems: 'center',
          }}>
          <Image source={{uri: item.poster_url}} style={styles.poster} />
          <Text style={styles.txt}>{truncatedName}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderItemCinema = ({item}) => {
    const truncatedName =
      item.name.length > 15 ? `${item.name.substring(0, 12)}...` : item.name;
    return (
      <TouchableOpacity
        activeOpacity={1}
        style={{
          marginBottom: 5,
          flex: 1,
        }}
        onPress={() =>
          navigation.navigate(
            'FilmDetail',
            {slug: item.slug},
            console.log(item.slug),
          )
        }>
        <View
          style={{
            alignItems: 'center',
          }}>
          <Image
            source={{uri: `https://img.phimapi.com/${item.poster_url}`}}
            style={styles.poster}
          />
          <Text style={styles.txt}>{truncatedName}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator animating={true} color={'#000'} />
      </View>
    );
  }

  return (
    <ScrollView
      style={{
        flex: 1,
        backgroundColor: '#000',
      }}
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}>
      <Slideshow
        dataSource={dataSlide}
        height={200}
        indicatorSize={8}
        arrowSize={20}
        overlay={true}
        containerStyle={{marginBottom: 10}}
        titleStyle={{textAlign: 'center', color: 'white', fontSize: 16}}
        onIndexChanged={handleSlideChange}
        scrollEnabled={false}
        onPress={slide => {
          if (slide && slide.image && slide.image.slug) {
            navigation.navigate(
              'FilmDetail',
              {slug: slide.image.slug},
              console.log(slide.image.slug),
            );
          } else {
            console.error('Slug not found in slide:', slide);
          }
        }}
      />

      <View style={{margin: 5}}>
        <View style={{marginBottom: 10}}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              padding: 10,
            }}>
            <Text style={styles.txtTitle}>Phim lẻ</Text>
          </View>
          <FlatList
            horizontal
            contentContainerStyle={{marginBottom: 10}}
            data={dataCinema}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderItemCinema}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
          />
          <Button
            style={styles.btnMore}
            textColor="#fff"
            onPress={() => navigation.navigate('Cinema')}>
            Xem thêm...
          </Button>
        </View>

        <View style={{marginBottom: 10}}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              padding: 10,
            }}>
            <Text style={styles.txtTitle}>Phim bộ</Text>
          </View>
          <FlatList
            horizontal
            contentContainerStyle={{
              marginBottom: 10,
              justifyContent: 'space-between',
              padding: 10,
            }}
            data={dataTVseries}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderItemCinema}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
          />
          <Button
            style={styles.btnMore}
            textColor="#fff"
            onPress={() => navigation.navigate('TVseries')}>
            Xem thêm...
          </Button>
        </View>

        <View style={{marginBottom: 10}}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              padding: 10,
            }}>
            <Text style={styles.txtTitle}>TVShow</Text>
          </View>
          <FlatList
            horizontal
            contentContainerStyle={{marginBottom: 10}}
            data={dataTVshow}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderItemCinema}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
          />
          <Button
            style={styles.btnMore}
            textColor="#fff"
            onPress={() => navigation.navigate('TVShow')}>
            Xem thêm...
          </Button>
        </View>

        <View style={{marginBottom: 10}}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              padding: 10,
            }}>
            <Text style={styles.txtTitle}>Animation</Text>
          </View>
          <FlatList
            horizontal
            contentContainerStyle={{marginBottom: 10}}
            data={dataCartoon}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderItemCinema}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
          />
          <Button
            style={styles.btnMore}
            textColor="#fff"
            onPress={() => navigation.navigate('Cartoon')}>
            Xem thêm...
          </Button>
        </View>

        <View style={{marginBottom: 10}}>
          <View>
            <Text style={styles.txtTitle}>Phim mới</Text>
          </View>
          <FlatList
            contentContainerStyle={styles.flatlst}
            data={data}
            numColumns={numColumns}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderItem}
          />
          <Button
            style={styles.btnMore}
            textColor="#fff"
            onPress={() => navigation.navigate('NewFilm')}>
            Xem thêm...
          </Button>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  flatlst: {
    flex: 1,
    // alignItems: 'center',
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
    color: '#fff',
  },

  txtTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },

  btnMore: {
    // fontSize: 120,
  },
});
