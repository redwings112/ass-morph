import React, { useState, useEffect, useMemo, useRef } from 'react';
import {  
  View,  
  Text,  
  TouchableOpacity,  
  StyleSheet,  
  ScrollView,  
  ActivityIndicator,  
  Animated,  
  Dimensions,  
  Image,  
  StatusBar  
} from 'react-native';
import { Video, ResizeMode, AVPlaybackStatus } from 'expo-av';  // ✅ Using `expo-av` again
import TopBar from '../../components/Topbar';

// BodyContent Component
const Home = () => {  
  const [counter, setCounter] = useState(0);  
  const [clickCount, setClickCount] = useState(0);  
  const [showVideo, setShowVideo] = useState(false);  
  const [isVideoReady, setIsVideoReady] = useState(false);  
  const fadeAnim = useMemo(() => new Animated.Value(0), []);  
  const videoRef = useRef<Video>(null);

  const screenWidth = Dimensions.get('window').width;  
  const screenHeight = Dimensions.get('window').height;  

  const videoSize = {  
    width: screenWidth - 8,  
    height: (screenWidth - 8) * (9 / 16),
  };

  useEffect(() => {  
    let interval: NodeJS.Timeout | null = null;  

    if (showVideo && counter < 3) {  
      interval = setInterval(() => {  
        setCounter((prevCounter) => {  
          if (prevCounter < 3) return prevCounter + 1;  
          clearInterval(interval!);  
          return 3;  
        });  
      }, 1000);  
    }  

    return () => {  
      if (interval) clearInterval(interval);  
    };  
  }, [showVideo]);  

  const handleVideoClick = () => {  
    if (isVideoReady) {
      setClickCount((prevCount) => (prevCount + 1) % 3);  
      setIsVideoReady(false);
    }
  };

  const getVideoSource = () => {  
    const videoFiles = [
      require('../../assets/video/2ndtwerk.mp4'),
      require('../../assets/video/1sttwerk.mp4'),
      require('../../assets/video/3rdtwerk.mp4'),
    ];
    return videoFiles[clickCount];
  };

  const videoSource = useMemo(() => getVideoSource(), [clickCount]);  

  const handleActivationButtonClick = () => {  
    setShowVideo(true);  
    setCounter(0);  
    setIsVideoReady(false);  
    Animated.timing(fadeAnim, {  
      toValue: 1,  
      duration: 1000,  
      useNativeDriver: true,  
    }).start();  
  };

  return (  
    <View style={styles.bodyContainer}>  
      <TopBar />  
      <ScrollView contentContainerStyle={styles.contentContainer}>  
        {!showVideo ? (  
          <TouchableOpacity  
            onPress={handleActivationButtonClick}  
            accessible  
            accessibilityLabel="Activate video"  
            accessibilityHint="Starts the countdown and shows the video"  
          >  
            <Image  
              source={require('../../assets/images/activation_button.png')}  
              style={styles.activationButtonImage}  
              resizeMode="contain"  
            />  
          </TouchableOpacity>  
        ) : (  
          <Animated.View style={{ opacity: fadeAnim }}>  
            {counter < 3 ? (  
              <Text style={styles.counter}>{counter}</Text>  
            ) : (  
              <TouchableOpacity  
                onPress={handleVideoClick}  
                style={styles.videoContainer}  
                accessible  
                accessibilityLabel="Play next video"  
                accessibilityHint="Cycles through available videos"  
              >  
                {!isVideoReady && <ActivityIndicator size="large" color="#FFA500" />}  
                <Video  
                  ref={videoRef}  
                  source={videoSource}  
                  style={[{ backgroundColor: '#000' }, videoSize]}  
                  resizeMode={ResizeMode.CONTAIN}  
                  shouldPlay  
                  isLooping  
                  useNativeControls  
                  onLoad={() => setIsVideoReady(true)}  
                  onError={(error) => console.error('Video Error:', error)}  
                />  
                {!isVideoReady && <Text style={styles.errorText}>Error loading video</Text>}  
              </TouchableOpacity>  
            )}  
          </Animated.View>  
        )}  
      </ScrollView>   
    </View>  
  );  
};

export default Home;

// Styles
const styles = StyleSheet.create({  
  bodyContainer: {  
    flex: 1,  
    backgroundColor: '#1E1E2C',  
  },  
  contentContainer: {  
    flexGrow: 1,  
    justifyContent: 'center',  
    alignItems: 'center',  
    padding: 20,  
  },  
  counter: {  
    fontSize: 100,  
    color: '#FFA500',  
    fontWeight: 'bold',  
  },  
  videoContainer: {  
    justifyContent: 'center',  
    alignItems: 'center',  
    marginVertical: 20,  
  },  
  activationButtonImage: {  
    width: 380,  
    height: 220,  
    marginTop: 150,  
  },  
  errorText: {  
    color: '#FF0000',  
    marginTop: 10,  
  },  
});

