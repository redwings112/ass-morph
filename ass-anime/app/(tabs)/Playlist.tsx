import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import TrackPlayer, { Track } from 'react-native-track-player';

type PlaylistItem = {
  id: string;
  name: string;
  artist: string;
  album: string;
  uri: string;
  lastPlayed: string | null;
  category: string;
};

type PlaylistProps = {
  navigation: any; // Replace `any` with proper type if using a navigation library like React Navigation
};

export default function Playlist({ navigation }: PlaylistProps) {
  const [playlist, setPlaylist] = useState<PlaylistItem[]>([]);
  const [lastPlayed, setLastPlayed] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlaylist = async () => {
      try {
        const savedPlaylist: PlaylistItem[] = [
          {
            id: '1',
            name: 'Song 1',
            artist: 'Artist 1',
            album: 'Album 1',
            uri: 'https://www.example.com/song1.mp3',
            lastPlayed: '2025-01-01T10:00:00Z',
            category: 'Pop',
          },
          {
            id: '2',
            name: 'Song 2',
            artist: 'Artist 2',
            album: 'Album 2',
            uri: 'https://www.example.com/song2.mp3',
            lastPlayed: '2025-01-02T15:00:00Z',
            category: 'Rock',
          },
          {
            id: '3',
            name: 'Song 3',
            artist: 'Artist 3',
            album: 'Album 3',
            uri: 'https://www.example.com/song3.mp3',
            lastPlayed: null,
            category: 'Jazz',
          },
        ];
        setPlaylist(savedPlaylist);

        const storedLastPlayed = await AsyncStorage.getItem('lastPlayed');
        if (storedLastPlayed) {
          setLastPlayed(JSON.parse(storedLastPlayed).id);
        }
      } catch (error) {
        console.error('Error fetching playlist:', error);
      }
    };

    fetchPlaylist();
  }, []);

  const openMusicPlayer = async (track: PlaylistItem) => {
    try {
      const newTrack: Track = {
        id: track.id,
        url: track.uri,
        title: track.name,
        artist: track.artist,
        album: track.album,
      };

      await TrackPlayer.add(newTrack);
      await TrackPlayer.play();

      setLastPlayed(track.id);
      await AsyncStorage.setItem('lastPlayed', JSON.stringify(track));

      navigation.navigate('MusicPlayer', { trackId: track.id });
    } catch (error) {
      console.error('Error playing track:', error);
      Alert.alert('Playback Error', 'Unable to play this track. Please try again later.');
    }
  };

  const renderTrack = ({ item }: { item: PlaylistItem }) => {
    const playDate = item.lastPlayed
      ? new Date(item.lastPlayed).toLocaleString()
      : 'Not Played Yet';

    return (
      <TouchableOpacity
        style={[
          styles.trackItem,
          lastPlayed === item.id ? { backgroundColor: '#f0f8ff' } : {},
        ]}
        onPress={() => openMusicPlayer(item)}
        accessible
        accessibilityLabel={`Play ${item.name} by ${item.artist}`}
      >
        <Image
          source={{ uri: item.uri || 'https://via.placeholder.com/50' }}
          style={styles.trackIcon}
        />
        <View style={styles.trackInfo}>
          <Text style={styles.trackName}>{item.name}</Text>
          <Text style={styles.trackDetails}>
            {item.artist} - {item.album}
          </Text>
          <Text style={styles.trackPlayDate}>{playDate}</Text>
        </View>
        <FontAwesome name="play-circle" size={30} color="#f02a7f" />
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Your Playlist</Text>

      <FlatList
        data={playlist}
        keyExtractor={(item) => item.id}
        renderItem={renderTrack}
        ListEmptyComponent={<Text>No tracks in the playlist.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#f02a7f',
    marginBottom: 20,
    textAlign: 'center',
  },
  trackItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginVertical: 5,
    borderRadius: 8,
  },
  trackIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
  },
  trackInfo: {
    flex: 1,
  },
  trackName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  trackDetails: {
    fontSize: 14,
    color: '#555',
  },
  trackPlayDate: {
    fontSize: 12,
    color: '#aaa',
    marginTop: 5,
  },
});
