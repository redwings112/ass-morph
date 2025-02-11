// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore'; // If you plan to use Firestore

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyDm3AwmAyYbI0b4yOzTP6GB_gxog4rT6pI',
  authDomain: 'ass-morph.firebaseapp.com',
  projectId: 'ass-morph',
  storageBucket: 'ass-morph.firebasestorage.app',
  messagingSenderId: '479310331449',
  appId: '1:479310331449:web:734f5be7cb8f5ecc0217e8',
  measurementId: 'G-NQH02GP5E9',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get Firebase Analytics (Optional)
const analytics = getAnalytics(app);

// Get Firebase Authentication
const auth = getAuth(app);

// Get Firestore instance (Optional, if you plan to use Firestore)
const db = getFirestore(app);

// Export Firebase services
export { auth, db, analytics };


