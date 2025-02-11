import React, { useState, useEffect } from 'react';
import { 
  View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Platform 
} from 'react-native';
import { Audio } from 'expo-av'; 
import * as DocumentPicker from 'react-native-document-picker'; // File picker for mobile

export default function MusicPlayer(): JSX.Element {
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [duration, setDuration] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [audioUri, setAudioUri] = useState<string>('');

  useEffect(() => {
    if (!audioUri) return;

    const loadAudio = async () => {
      try {
        setIsLoading(true);
        const { sound } = await Audio.Sound.createAsync(
          { uri: audioUri },
          { shouldPlay: false }, // Do not autoplay
          handlePlaybackStatusUpdate
        );
        setSound(sound);
      } catch (error) {
        console.error('Error loading audio', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadAudio();

    return () => {
      if (sound) {
        sound.setOnPlaybackStatusUpdate(null);
        sound.unloadAsync();
      }
    };
  }, [audioUri]);

  const handlePlaybackStatusUpdate = (status: any) => {
    if (status.isLoaded) {
      setDuration(status.durationMillis || 0);
      setCurrentTime(status.positionMillis || 0);
      setIsPlaying(status.isPlaying);
    }
  };

  const handlePlayPause = async () => {
    if (sound) {
      if (isPlaying) {
        await sound.pauseAsync();
      } else {
        await sound.playAsync();
      }
    }
  };

  const handleStop = async () => {
    if (sound) {
      await sound.stopAsync();
      setIsPlaying(false);
    }
  };

  const handleFastForward = async () => {
    if (sound) {
      const newTime = Math.min(currentTime + 10000, duration);
      await sound.setPositionAsync(newTime);
    }
  };

  const handleRewind = async () => {
    if (sound) {
      const newTime = Math.max(currentTime - 10000, 0);
      await sound.setPositionAsync(newTime);
    }
  };

  const handleFileUpload = async () => {
    try {
      if (Platform.OS === 'web') {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'audio/*';
        input.onchange = (event: any) => {
          const file = event.target.files[0];
          if (file) {
            const fileUrl = URL.createObjectURL(file);
            setAudioUri(fileUrl);
          }
        };
        input.click();
      } else {
        const result = await DocumentPicker.pickSingle({
          type: DocumentPicker.types.audio,
        });
        if (result && result.uri) {
          setAudioUri(result.uri);
        }
      }
    } catch (error) {
      console.error('Error picking file:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Audio Player</Text>

      {/* Upload Button */}
      <TouchableOpacity onPress={handleFileUpload} style={styles.button}>
        <Text style={styles.buttonText}>Select Audio File</Text>
      </TouchableOpacity>

      <Text style={styles.info}>
        {Math.floor(currentTime / 1000)} / {Math.floor(duration / 1000)} seconds
      </Text>

      <TouchableOpacity onPress={handlePlayPause} style={styles.button}>
        <Text style={styles.buttonText}>{isPlaying ? 'Pause' : 'Play'}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleStop} style={styles.button}>
        <Text style={styles.buttonText}>Stop</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleFastForward} style={styles.button}>
        <Text style={styles.buttonText}>Fast Forward</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleRewind} style={styles.button}>
        <Text style={styles.buttonText}>Rewind</Text>
      </TouchableOpacity>

      {isLoading && <ActivityIndicator size="large" color="#FF0080" />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  info: {
    fontSize: 16,
    marginVertical: 10,
  },
  button: {
    backgroundColor: '#FF0080',
    padding: 15,
    borderRadius: 5,
    width: '80%',
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
