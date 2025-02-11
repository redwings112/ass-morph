import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native'; // Only one NavigationContainer at the root
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

// Define the navigation stack types
type RootStackParamList = {
  Home: undefined;
  MusicPlayer: undefined;
  Contact: undefined;
  Playlist: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer> {/* Only one NavigationContainer wrapping the entire app */}
      <View style={{ flex: 1 }}>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="MusicPlayer" component={MusicPlayerScreen} />
          <Stack.Screen name="Contact" component={ContactScreen} />
          <Stack.Screen name="Playlist" component={PlaylistScreen} />
        </Stack.Navigator>
        <NavBar /> {/* NavBar should be outside of the Stack.Navigator */}
      </View>
    </NavigationContainer>
  );
}

// 🏠 Home Screen
function HomeScreen() {
  return (
    <View style={styles.screen}>
      <Text>Home Screen</Text>
    </View>
  );
}

// 🎵 Music Player Screen
function MusicPlayerScreen() {
  return (
    <View style={styles.screen}>
      <Text>Music Player Screen</Text>
    </View>
  );
}

// 📧 Contact Screen
function ContactScreen() {
  return (
    <View style={styles.screen}>
      <Text>Contact Screen</Text>
    </View>
  );
}

// 📃 Playlist Screen
function PlaylistScreen() {
  return (
    <View style={styles.screen}>
      <Text>Playlist Screen</Text>
    </View>
  );
}

// 📌 Bottom Navigation Bar
function NavBar() {
  return (
    <View style={styles.navBar}>
      {/* Home Icon */}
      <TouchableOpacity style={styles.navButton}>
        <FontAwesome name="home" size={24} color="#f02a7f" />
      </TouchableOpacity>

      {/* Music Player Icon */}
      <TouchableOpacity style={styles.navButton}>
        <FontAwesome name="music" size={24} color="#f02a7f" />
      </TouchableOpacity>

      {/* Contact Icon */}
      <TouchableOpacity style={styles.navButton}>
        <FontAwesome name="envelope" size={24} color="#f02a7f" />
      </TouchableOpacity>

      {/* Playlist Icon */}
      <TouchableOpacity style={styles.navButton}>
        <FontAwesome name="list" size={24} color="#f02a7f" />
      </TouchableOpacity>
    </View>
  );
}

// 🎨 Styles
const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
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
