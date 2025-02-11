import React, { useState, useEffect } from 'react';
import { 
  View, 
  TextInput, 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  ActivityIndicator, 
  Alert 
} from 'react-native';
import { auth, db } from '../services/firebaseConfig';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { setDoc, doc, serverTimestamp } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/types';

type SignUpScreenNavigationProp = StackNavigationProp<RootStackParamList, 'SignUp'>;

export default function SignUpScreen(): JSX.Element {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const navigation = useNavigation<SignUpScreenNavigationProp>();

  // Automatically clear error after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(''), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleSignUp = async (): Promise<void> => {
    if (!email || !password) {
      setError('Email and password are required');
      return;
    }

    // Email validation
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    // Password validation (at least 6 chars, 1 uppercase, 1 number)
    if (!/(?=.*[A-Z])(?=.*\d).{6,}/.test(password)) {
      setError('Password must be at least 6 characters long, include an uppercase letter and a number');
      return;
    }

    setLoading(true);
    try {
      // Firebase authentication to create user
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Send email verification
      await sendEmailVerification(user);

      // Save user data to Firestore
      await setDoc(doc(db, 'users', user.uid), {
        email: user.email,
        createdAt: serverTimestamp(),
      });

      setError('');
      Alert.alert('Success', 'Account created successfully! Please check your email for verification.');
      navigation.navigate('SignIn'); 
    } catch (error: any) {
      const firebaseErrors: Record<string, string> = {
        'auth/email-already-in-use': 'Email is already in use',
        'auth/invalid-email': 'Invalid email address',
        'auth/weak-password': 'Weak password, please use a stronger password',
      };
      setError(firebaseErrors[error.code] || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>

      {/* Input Fields */}
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#888"
        value={email}
        onChangeText={(text) => setEmail(text)}
        keyboardType="email-address"
        autoCapitalize="none"
        editable={!loading}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#888"
        secureTextEntry
        value={password}
        onChangeText={(text) => setPassword(text)}
        editable={!loading}
      />
      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      {/* Loading Spinner */}
      {loading && <ActivityIndicator size="large" color="#FF0080" />}

      {/* Sign Up Button */}
      <TouchableOpacity style={[styles.button, loading && styles.disabledButton]} onPress={handleSignUp} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? 'Signing Up...' : 'Sign Up'}</Text>
      </TouchableOpacity>

      {/* Navigation to Sign In */}
      <TouchableOpacity onPress={() => navigation.navigate('SignIn')}>
        <Text style={styles.switchText}>Already have an account? Sign In</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  input: {
    width: '100%',
    padding: 12,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    fontSize: 16,
    backgroundColor: '#f8f8f8',
  },
  button: {
    backgroundColor: '#FF0080',
    padding: 15,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
    fontSize: 14,
  },
  switchText: {
    marginTop: 20,
    color: '#007BFF',
  },
});

