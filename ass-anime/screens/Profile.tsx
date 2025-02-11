import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import DocumentPicker from 'react-native-document-picker'; // For selecting audio files
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Profile() {
  const [isUploading, setIsUploading] = useState(false);

  // Function to handle file selection
  const selectMusic = async () => {
    try {
      const response = await DocumentPicker.pick({
        type: [DocumentPicker.types.audio], // Only select audio files
      });
  
      // Check if we got at least one file in the response
      if (response && response.length > 0) {
        const fileUri = response[0].uri;  // Access the first file's URI
        console.log('Selected file URI:', fileUri); // Optionally log the URI for debugging
        handleUpload(fileUri);
      } else {
        // Handle case where no files were selected
        Alert.alert('Error', 'No file selected.');
      }
    } catch (error) {
      if (DocumentPicker.isCancel(error)) {
        console.log('User canceled file selection');
        // You can add logic for cancellation if needed
      } else {
        console.error('Error selecting file:', error);
        Alert.alert('Error', 'An unexpected error occurred while selecting the file.');
      }
    }
  };
  
  // Handle upload to Firebase
  const handleUpload = async (fileUri: string) => {
    try {
      setIsUploading(true);

      // First, try to save the file to AsyncStorage
      const fileName = fileUri.split('/').pop(); // Get the file name from URI
      const fileBase64 = await uriToBase64(fileUri); // Convert URI to base64 string (for storage)

      const isStorageAvailable = await checkStorageAvailability(fileBase64);

      if (isStorageAvailable) {
        // Save to AsyncStorage if space is available
        await AsyncStorage.setItem(fileName!, fileBase64);
        Alert.alert('Success', 'File saved in local storage!');
      } else {
        // If local storage is full, upload the file to Firebase Cloud Storage
        await uploadToCloudStorage(fileUri, fileName!);
      }
    } catch (error) {
      console.error('Upload failed', error);
      Alert.alert('Error', 'An error occurred during the upload');
    } finally {
      setIsUploading(false);
    }
  };

  // Function to check if local storage has enough space (just a placeholder, you'd need your own logic)
  const checkStorageAvailability = async (fileBase64: string) => {
    const existingStorage = await AsyncStorage.getItem('storageUsed');
    const newStorageUsage = existingStorage ? existingStorage.length + fileBase64.length : fileBase64.length;

    // Assume 5MB is the limit for local storage in your app
    const storageLimit = 5 * 1024 * 1024; // 5MB

    if (newStorageUsage > storageLimit) {
      return false; // Not enough space, upload to the cloud
    }

    // Update the storage usage in AsyncStorage
    await AsyncStorage.setItem('storageUsed', String(newStorageUsage));
    return true; // Local storage has enough space
  };

  // Convert file URI to base64 (if you want to use base64 string in AsyncStorage)
  const uriToBase64 = async (uri: string): Promise<string> => {
    const response = await fetch(uri);
    const blob = await response.blob();
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result as string);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  // Upload file to Firebase Cloud Storage if local storage fails
  const uploadToCloudStorage = async (fileUri: string, fileName: string) => {
    const reference = storage().ref('musicFiles/' + fileName);
    const uploadTask = reference.putFile(fileUri);

    uploadTask.on('state_changed', (taskSnapshot) => {
      // Monitor upload progress here
    });

    uploadTask
      .then(() => {
        Alert.alert('Success', 'File uploaded to cloud storage!');
        saveFileMetadataToDatabase(fileName);
      })
      .catch((error) => {
        console.error('Cloud upload failed', error);
        Alert.alert('Error', 'Failed to upload file to the cloud');
      });
  };

  // Save file metadata (e.g., file name, user info) to Firestore
  const saveFileMetadataToDatabase = async (fileName: string) => {
    try {
      await firestore().collection('musicFiles').add({
        fileName,
        createdAt: firestore.FieldValue.serverTimestamp(),
      });
      console.log('File metadata saved');
    } catch (error) {
      console.error('Error saving metadata', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile Page</Text>
      <TouchableOpacity style={styles.button} onPress={selectMusic} disabled={isUploading}>
        <Text style={styles.buttonText}>{isUploading ? 'Uploading...' : 'Select Music'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#f02a7f',
    padding: 15,
    borderRadius: 5,
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
});
