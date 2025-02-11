import React from 'react';
import { View, Image, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/types'; // Ensure this file exists

// Type navigation prop for type safety
type GetStartedScreenNavigationProp = StackNavigationProp<RootStackParamList, 'GetStarted'>;

export default function GetStarted() {
  const navigation = useNavigation<GetStartedScreenNavigationProp>(); // Ensure proper typing

  return (
    <View style={styles.container}>
      <Image source={require('../../ass-anime/assets/images/logo.png')} style={styles.logo} />
      <TouchableOpacity 
        style={styles.button} 
        onPress={() => navigation.navigate('Home')} // Ensure 'Home' exists in navigation
      >
        <Text style={styles.buttonText}>Get Started</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: '#fff' 
  },
  logo: { 
    width: 250, 
    height: 150, 
    resizeMode: 'contain' 
  },
  button: { 
    backgroundColor: '#D81B60', 
    padding: 15, 
    borderRadius: 25, 
    width: '80%', 
    alignItems: 'center', 
    position: 'absolute', 
    bottom: 50 
  },
  buttonText: { 
    color: '#fff', 
    fontSize: 18, 
    fontWeight: 'bold' 
  },
});
