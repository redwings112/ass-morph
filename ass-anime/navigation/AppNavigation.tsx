import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { TouchableOpacity } from 'react-native';
import GetStarted from '../screens/GetStarted';
import SignIn from '../screens/SignIn';
import SignUp from '../screens/Signup';
import Home from '../(tabs)/Home';
import PlaylistScreen from '../components/Playlist'; // New Playlist Screen
import ContactUsScreen from '../screens/Contact'; // New Contact Us Screen
import MusicPlayerScreen from '../components/MusicPlayer';
import { RootStackParamList } from './types'; //

const Stack = createStackNavigator<RootStackParamList>(); // Type the Stack Navigator

export default function AppNavigation(): JSX.Element {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="GetStarted"
        screenOptions={{ headerShown: false }}  // Hide header for all screens
      >
        <Stack.Screen name="GetStarted" component={GetStarted} />
        <Stack.Screen name="SignIn" component={SignIn} />
        <Stack.Screen name="SignUp" component={SignUp} />
        <Stack.Screen name="Home" component={Home} />
        
        {/* New Screens */}
        <Stack.Screen name="Playlist" component={PlaylistScreen} />
        <Stack.Screen name="ContactUs" component={ContactUsScreen} />
        <Stack.Screen name="MusicPlayer" component={MusicPlayerScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
