import React from 'react';
import { View, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons'; // Import FontAwesome icons

export default function TopBar(): JSX.Element {
  return (
    <View style={styles.topBar}>
      {/* Sidebar Icon */}
      <TouchableOpacity>
        <FontAwesome name="bars" size={24} color="#f02a7f" style={styles.icon} />
      </TouchableOpacity>

      {/* App Logo */}
      <Image
        source={require('../../ass-anime/assets/images/logo.png')} // Replace with your logo path
        style={styles.logo}
      />

      {/* Profile Icon */}
      <TouchableOpacity>
        <FontAwesome name="user-circle" size={24} color="#f02a7f" style={styles.icon} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingTop: 40,
    paddingBottom: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  logo: {
    width: 180,
    height: 120,
    resizeMode: 'contain', // Maintain the aspect ratio of the logo
  },
  icon: {
    marginHorizontal: 10, // Space around the icons
  },
});

