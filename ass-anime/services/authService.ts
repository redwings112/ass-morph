import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../services/firebaseConfig';

// Function to sign up a new user
export const signUp = async (email: string, password: string): Promise<void> => {
  const authInstance = getAuth();
  try {
    await createUserWithEmailAndPassword(authInstance, email, password);
  } catch (error: any) {
    throw new Error(error.message);
  }
};

// Function to sign in an existing user
export const signIn = async (email: string, password: string): Promise<void> => {
  const authInstance = getAuth();
  try {
    await signInWithEmailAndPassword(authInstance, email, password);
  } catch (error: any) {
    throw new Error(error.message);
  }
};

// Function to log out the user
export const logOut = async (): Promise<void> => {
  const authInstance = getAuth();
  try {
    await signOut(authInstance);
  } catch (error: any) {
    throw new Error(error.message);
  }
};

// Listener to track authentication state changes
export const onAuthStateChangedListener = (callback: (user: any) => void): () => void => {
  const authInstance = getAuth();
  const unsubscribe = onAuthStateChanged(authInstance, callback);
  return unsubscribe; // Return unsubscribe function to clean up
};
