import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { db } from '../../../ass-anime/services/firebaseConfig';
import { collection, addDoc } from 'firebase/firestore'; // Firebase Firestore functions

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  message: string;
}

export default function ContactUs() {
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData((prevData) => ({ ...prevData, [field]: value }));
  };

  const handleSubmit = async () => {
    const { firstName, lastName, email, phone, message } = formData;

    // Validation
    if (!firstName || !lastName || !email || !message) {
      Alert.alert('Error', 'Please fill out all required fields.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Error', 'Please enter a valid email address.');
      return;
    }

    const phoneRegex = /^[0-9]{10,15}$/;
    if (phone && !phoneRegex.test(phone)) {
      Alert.alert('Error', 'Please enter a valid phone number.');
      return;
    }

    setIsSubmitting(true);

    try {
      // Add the form data to Firestore
      await addDoc(collection(db, 'contacts'), formData); // "contacts" is the Firestore collection name

      Alert.alert('Success', 'Your message has been submitted!');
      setFormData({ firstName: '', lastName: '', email: '', phone: '', message: '' });
    } catch (error) {
      Alert.alert('Error', 'There was an error submitting your message.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Contact Us</Text>
      <TextInput
        style={styles.input}
        placeholder="First Name"
        value={formData.firstName}
        onChangeText={(text) => handleChange('firstName', text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Last Name"
        value={formData.lastName}
        onChangeText={(text) => handleChange('lastName', text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        keyboardType="email-address"
        value={formData.email}
        onChangeText={(text) => handleChange('email', text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Phone Number"
        keyboardType="phone-pad"
        value={formData.phone}
        onChangeText={(text) => handleChange('phone', text)}
      />
      <TextInput
        style={styles.textArea}
        placeholder="Message"
        multiline
        value={formData.message}
        onChangeText={(text) => handleChange('message', text)}
      />
      <TouchableOpacity
        style={[styles.submitButton, isSubmitting && { backgroundColor: '#ccc' }]}
        onPress={handleSubmit}
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.submitButtonText}>Submit</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#D81B60',
    textAlign: 'center',
    marginVertical: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  textArea: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 10,
    padding: 10,
    height: 100,
    textAlignVertical: 'top',
    marginBottom: 15,
    fontSize: 16,
  },
  submitButton: {
    backgroundColor: '#D81B60',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
