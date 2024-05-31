import React, {useEffect, useState} from 'react';
import {
  TouchableOpacity,
  View,
  Image,
  StyleSheet,
  Dimensions,
} from 'react-native';
import {FlatList, ScrollView} from 'react-native-gesture-handler';
import {ActivityIndicator, Text, Button, IconButton} from 'react-native-paper';
import {
  addFav,
  addHis,
  updateHis,
  delFav,
  useMyContextProvider,
  checkEPHis,
} from '../store/index';
import firestore from '@react-native-firebase/firestore';

export default function FilmDetail({route, navigation}) {
  const [controller, dispatch] = useMyContextProvider();
  const {userLogin} = controller;
  const {slug} = route.params;
  const [loading, setLoading] = useState(false);
  const [movie, setMovie] = useState(null);
  const [episodes, setEpisodes] = useState([]);
  const [countryFilm, setCountryFilm] = useState(null);
  const [showFullContent, setShowFullContent] = useState(false);
  const FAVORITES = firestore().collection('FAVORITES');
  const HISTORY = firestore().collection('HISTORY');
  const [checkFav, setCheckFav] = useState(false);
  const [checkHis, setCheckHis] = useState(false);
  const [watchedEpisodes, setWatchedEpisodes] = useState({});

  const onAddFav = async () => {
    try {
      await addFav(userLogin.email, slug, movie.name, movie.poster_url);
      setCheckFav(true); // Update state after successful addition
    } catch (error) {
      console.error('Error adding to favorites:', error);
    }
  };

  // Async function for deleting a favorite
  const onDelFav = async () => {
    try {
      await delFav(userLogin.email + '_' + slug);
      setCheckFav(false); // Update state after successful deletion
    } catch (error) {
      console.error('Error deleting from favorites:', error);
    }
  };

  const fetchApi = async slug_film => {
    try {
      const response = await fetch(`https://phimapi.com/phim/${slug_film}`);
      const json = await response.json();
      if (json.status === true) {
        setMovie(json.movie);
        setEpisodes(json.episodes);
        console.log(json.country);
      } else {
        console.error('Failed to fetch data:', json.msg);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApi(slug);
    if (userLogin !== null) {
      const docid = userLogin.email + '_' + slug;
      console.log(docid);
      const checkFilmFav = FAVORITES.doc(docid).onSnapshot(response => {
        const data = response.data();
        console.log(data);
        if (data != null) setCheckFav(true);
      });
      const checkFilmHis = HISTORY.doc(docid).onSnapshot(response => {
        const data = response.data();
        console.log(data);
        if (data != null) setCheckHis(true);
      });

      return () => {
        checkFilmFav();
        checkFilmHis();
      };
    }
  }, [slug, userLogin]);

  useEffect(() => {
    if (userLogin !== null && episodes.length > 0) {
      const fetchWatchedEpisodes = async () => {
        const watchedStatus = {};
        for (const episode of episodes[0]?.server_data || []) {
          const isWatched = await checkEPHis(
            userLogin.email,
            slug,
            episode.slug,
          );
          watchedStatus[episode.slug] = isWatched;
        }
        setWatchedEpisodes(watchedStatus);
      };
      fetchWatchedEpisodes();
    }
  }, [episodes, userLogin]);

  const handleEpisodePress = async item => {
    if (userLogin !== null) {
      if (checkHis) {
        await updateHis(userLogin.email, slug, item.slug);
      } else {
        await addHis(
          userLogin.email,
          slug,
          movie.name,
          movie.poster_url,
          item.slug,
        );
      }

      // Update the watched status
      const watchedStatus = {...watchedEpisodes, [item.slug]: true};
      setWatchedEpisodes(watchedStatus);

      navigation.navigate('PlayVideo', {
        episodes: item,
        data: episodes[0].server_data,
        movie: movie,
      });
    } else {
      navigation.navigate('PlayVideo', {
        episodes: item,
        data: episodes[0].server_data,
        movie: movie,
      });
    }
  };

  const renderItem = ({item}) => {
    return (
      <View style={styles.itemContainer}>
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => handleEpisodePress(item)}
          style={
            watchedEpisodes[item.slug]
              ? styles.watched
              : styles.touchableOpacity
          }>
          <Text
            style={
              watchedEpisodes[item.slug]
                ? styles.watchedText
                : styles.buttonText
            }>
            {item.name}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderContent = () => {
    if (movie.content && movie.content.length > 4) {
      const truncatedContent = showFullContent
        ? movie.content
        : movie.content.slice(0, 200) + '...';
      return (
        <>
          <Text style={{...styles.txt, textAlign: 'justify'}}>
            {truncatedContent}
          </Text>
          <Button
            textColor="#fff"
            onPress={() => setShowFullContent(!showFullContent)}>
            {showFullContent ? 'Ẩn bớt' : 'Xem thêm...'}
          </Button>
        </>
      );
    } else {
      return <Text>{movie.content}</Text>;
    }
  };

  const countryName =
    movie && movie.country && movie.country.length > 0
      ? movie.country[0].name
      : 'N/A';

  const getCategoryNames = () => {
    if (movie && movie.category && movie.category.length > 0) {
      return movie.category.map(category => category.name).join(', ');
    }
    return 'N/A';
  };

  const categoryName = getCategoryNames();

  if (loading || !movie || episodes.length === 0) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator animating={true} color={'#000'} />
      </View>
    );
  }

  return (
    <ScrollView style={{flex: 1, padding: 10, backgroundColor: '#000'}}>
      <Image source={{uri: movie.poster_url}} style={styles.image} />
      <Text
        style={{
          color: '#fff',
          fontSize: 25,
          fontWeight: 'bold',
          marginBottom: 10,
        }}>
        {movie.name}
      </Text>
      <Text style={styles.txt}>● Tên gốc: {movie.origin_name}</Text>
      <Text style={styles.txt}>● Thời lượng: {movie.time}</Text>
      <Text style={styles.txt}>● Năm phát hành: {movie.year}</Text>
      <Text style={styles.txt}>● Quốc gia: {countryName}</Text>
      <Text style={styles.txt}>● Thể loại: {categoryName}</Text>
      <Text style={styles.txt}>● Định dạng phim: {movie.lang}</Text>
      {userLogin !== null ? (
        checkFav ? (
          <IconButton
            icon="heart"
            iconColor="#fff"
            size={30}
            onPress={onDelFav}
          />
        ) : (
          <IconButton
            icon="cards-heart-outline"
            iconColor="#fff"
            size={30}
            onPress={onAddFav}
          />
        )
      ) : (
        <IconButton
          icon="cards-heart-outline"
          iconColor="#fff"
          size={30}
          style={{opacity: 0.5}}
        />
      )}
      {renderContent()}
      <FlatList
        numColumns={Math.floor(Dimensions.get('window').width / 120)}
        data={episodes[0].server_data}
        keyExtractor={item => item.slug}
        renderItem={renderItem}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  image: {
    alignSelf: 'center',
    resizeMode: 'center',
    marginBottom: 10,
    height: 250,
    width: '100%',
  },
  txt: {
    color: '#fff',
    fontSize: 18,
    marginBottom: 5,
  },
  itemContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    marginVertical: 5,
    marginBottom: 15,
  },
  touchableOpacity: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 100,
    height: 50,
    borderWidth: 1,
    borderColor: '#fff',
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  watched: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 100,
    height: 50,
    borderWidth: 5,
    borderColor: 'grey',
    borderRadius: 5,
  },
  watchedText: {
    color: 'grey',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: 'bold',
  },
});
