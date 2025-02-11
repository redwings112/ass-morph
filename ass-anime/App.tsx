import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { View, TouchableOpacity, StyleSheet, Text, StatusBar } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import GetStarted from './screens/GetStarted'; // Ensure this file exists
import Home from './app/(tabs)/Home'; // Ensure this file exists
import Music from '../ass-anime/app/(tabs)/MusicPlayer'; // Ensure this file exists
import 'react-native-polyfill-globals/auto'; // Polyfill for compatibility
import { useNavigation } from '@react-navigation/native'; // Correct import
import Playlist from './app/(tabs)/Playlist';
import Contact from './app/(tabs)/Contact';

// Initialize Stack Navigator
const Stack = createStackNavigator();

// App component
const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Example for route protection

  useEffect(() => {
    // Simulate checking authentication state
    setTimeout(() => {
      setIsAuthenticated(true); // Change to `true` to show protected routes
    }, 2000); // Simulate a delay in the authentication check
  }, []);

  return (
    <NavigationContainer>
      {/* Optional: Set status bar style */}
      <StatusBar barStyle="dark-content" />

      <View style={{ flex: 1 }}>
        {/* Stack Navigator with custom screen options */}
        <Stack.Navigator initialRouteName={isAuthenticated ? "Home" : "GetStarted"} screenOptions={{ headerShown: false }}>
          <Stack.Screen name="GetStarted" component={GetStarted} />
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="Music" component={Music} /> {/* Add Music Screen */}
          {/* Add other screens like Contact and Playlist */}
          <Stack.Screen name="Contact" component={Contact} /> {/* Ensure Contact screen exists */}
          <Stack.Screen name="Playlist" component={Playlist} /> {/* Ensure Playlist screen exists */}
        </Stack.Navigator>

        {/* Bottom Navigation Bar */}
        {isAuthenticated && (
          <View style={styles.navBar}>
            {/* Home Icon */}
            <TouchableOpacity 
              style={styles.navButton}
                onPress={() => {
                // Navigate to the Music screen when the icon is clicked
                const navigation = useNavigation();
                navigation.navigate('Home');
              }}
            >
              <FontAwesome name="home" size={24} color="#f02a7f" />
            </TouchableOpacity>

            {/* Music Player Icon */}
            <TouchableOpacity
              style={styles.navButton}
              onPress={() => {
                // Navigate to the Music screen when the icon is clicked
                const navigation = useNavigation();
                navigation.navigate('Music');
              }}
            >
              <FontAwesome name="music" size={24} color="#f02a7f" />
            </TouchableOpacity>

            {/* Contact Icon */}
            <TouchableOpacity 
              style={styles.navButton}
              onPress={() => {
                const navigation = useNavigation();
                navigation.navigate('Contact'); // Navigate to Contact
              }}
            >
              <FontAwesome name="envelope" size={24} color="#f02a7f" />
            </TouchableOpacity>

            {/* Playlist Icon */}
            <TouchableOpacity 
              style={styles.navButton}
              onPress={() => {
                const navigation = useNavigation();
                navigation.navigate('Playlist'); // Navigate to Playlist
              }}
            >
              <FontAwesome name="list" size={24} color="#f02a7f" />
            </TouchableOpacity>
          </View>
        )}
      </View>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },
  navButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default App;
