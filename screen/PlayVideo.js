import React, {useState, useEffect} from 'react';
import {View, StyleSheet, Dimensions, ScrollView, FlatList} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {Button, Text} from 'react-native-paper';
import {WebView} from 'react-native-webview';
import {updateHis, useMyContextProvider, checkEPHis} from '../store/index';
import firestore from '@react-native-firebase/firestore';

export default function PlayVideo({navigation, route}) {
  const [controller, dispatch] = useMyContextProvider();
  const {userLogin} = controller;
  const {episodes, data, movie} = route.params;
  const urlVideo = episodes.link_embed;
  const [watchedEpisodes, setWatchedEpisodes] = useState({});
  const HISTORY = firestore().collection('HISTORY');

  const episodeNames = data;

  useEffect(() => {
    if (userLogin !== null && episodeNames.length > 0) {
      const fetchWatchedEpisodes = async () => {
        const watchedStatus = {};
        for (const episode of episodeNames) {
          const isWatched = await checkEPHis(
            userLogin.email,
            movie.slug,
            episode.slug,
          );
          watchedStatus[episode.slug] = isWatched;
        }
        setWatchedEpisodes(watchedStatus);
      };
      fetchWatchedEpisodes();
    }
  }, [episodeNames, userLogin]);

  const renderItem = ({item}) => {
    const isCurrentEpisode = item.filename === episodes.filename;
    const isWatched = watchedEpisodes[item.slug];
    const buttonStyle = isCurrentEpisode
      ? styles.disabledButton
      : isWatched
      ? styles.watchedButton
      : styles.touchableOpacity;
    const buttonTextStyle = isCurrentEpisode
      ? styles.disabledButtonText
      : isWatched
      ? styles.watchedText
      : styles.buttonText;

    return (
      <View style={styles.itemContainer}>
        {userLogin !== null ? (
          <TouchableOpacity
            activeOpacity={1}
            style={buttonStyle}
            onPress={() => {
              updateHis(userLogin.email, movie.slug, item.slug);
              if (!isCurrentEpisode) {
                navigation.navigate('PlayVideo', {
                  episodes: item,
                  data: data,
                  movie: movie,
                });
              }
            }}>
            <Text style={buttonTextStyle}>{item.name}</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            activeOpacity={1}
            style={buttonStyle}
            onPress={() => {
              if (!isCurrentEpisode) {
                navigation.navigate('PlayVideo', {
                  episodes: item,
                  data: data,
                  movie: movie,
                });
              }
            }}>
            <Text style={buttonTextStyle}>{item.name}</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <View style={{flex: 1, backgroundColor: '#000'}}>
      <View style={styles.container}>
        <WebView
          source={{uri: urlVideo}}
          startInLoadingState={true}
          automaticallyAdjustContentInsets={false}
          allowsFullscreenVideo={true}
          allowsBackForwardNavigationGestures={true}
          mediaPlaybackRequiresUserAction={true}
        />
      </View>
      <View>
        <Text style={styles.txtEp}>{episodes.filename}</Text>
      </View>
      <ScrollView style={{flex: 1}}>
        <Text
          style={{
            padding: 5,
            color: '#fff',
            fontSize: 18,
            fontWeight: 'bold',
            marginLeft: 20,
          }}>
          Tập phim
        </Text>
        <FlatList
          style={{padding: 10}}
          numColumns={Math.floor(Dimensions.get('window').width / 120)}
          data={episodeNames}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderItem}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 200,
    padding: 10,
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
  txtEp: {
    padding: 10,
    textAlign: 'justify',
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  disabledButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 100,
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    backgroundColor: '#eee',
  },
  disabledButtonText: {
    color: '#888',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  watchedButton: {
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
