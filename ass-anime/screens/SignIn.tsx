import React, { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { useNavigation, NavigationProp } from '@react-navigation/native';

type RootStackParamList = {
  Home: undefined;
  SignUp: undefined;
};

export default function SignInScreen(): JSX.Element {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [isSignUp, setIsSignUp] = useState<boolean>(false);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  useEffect(() => {
    if (error) {
      const timeout = setTimeout(() => setError(''), 5000);
      return () => clearTimeout(timeout);
    }
  }, [error]);

  const handleAuth = async (): Promise<void> => {
    if (!email || !password || (isSignUp && !name)) {
      setError('Email, password, and name (for Sign Up) are required');
      return;
    }

    const auth = getAuth();
    setLoading(true);

    try {
      let userCredential;
      if (isSignUp) {
        userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await submitUserData(userCredential.user.uid, name);
      } else {
        userCredential = await signInWithEmailAndPassword(auth, email, password);
      }

      setError('');
      navigation.navigate('Home');
    } catch (error: any) {
      const firebaseErrors: Record<string, string> = {
        'auth/invalid-email': 'Invalid email address',
        'auth/user-not-found': 'No user found with this email',
        'auth/wrong-password': 'Incorrect password',
        'auth/email-already-in-use': 'Email already in use',
      };
      setError(firebaseErrors[error.code] || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const submitUserData = async (userId: string, name: string) => {
    try {
      await firestore().collection('users').doc(userId).set({
        name,
        email,
        createdAt: firestore.Timestamp.now(),
      });
      console.log('User data submitted to Firestore');
    } catch (error) {
      console.error('Error submitting user data to Firestore', error);
      Alert.alert('Error', 'Failed to submit user data');
    }
  };

  return (
    <View style={styles.container}>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      {isSignUp && (
        <TextInput
          style={styles.input}
          placeholder="Name"
          placeholderTextColor="#888"
          value={name}
          onChangeText={setName}
          autoCapitalize="words"
          editable={!loading}
        />
      )}

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#888"
        value={email}
        onChangeText={setEmail}
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
        onChangeText={setPassword}
        editable={!loading}
      />

      {loading && <ActivityIndicator size="large" color="#FF0080" />}

      <TouchableOpacity style={styles.button} onPress={handleAuth} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? 'Processing...' : isSignUp ? 'Sign Up' : 'Sign In'}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => setIsSignUp(!isSignUp)}>
        <Text style={styles.switchText}>
          {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#1E1E2C',
  },
  input: {
    width: '100%',
    padding: 12,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#444',
    borderRadius: 10,
    backgroundColor: '#292A33',
    color: '#fff',
    fontSize: 16,
  },
  button: {
    backgroundColor: '#FF0080',
    padding: 15,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
    marginBottom: 10,
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
    color: '#FFA500',
    marginTop: 10,
    fontSize: 14,
  },
});
