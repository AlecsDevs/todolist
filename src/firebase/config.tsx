// firebase/config.js

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// NEW: Import getDatabase
import { getDatabase } from "firebase/database"; 

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {

    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};
console.log("FIREBASE_API_KEY:", import.meta.env.VITE_FIREBASE_API_KEY);

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// NEW: Initialize Firebase Realtime Database and get a reference to the service
export const db = getDatabase(app); 

// Initialize Google Auth Provider
export const googleProvider = new GoogleAuthProvider();

// Configure Google provider settings to request profile information
googleProvider.addScope('profile');
googleProvider.addScope('email');

// Optional: Configure custom parameters
googleProvider.setCustomParameters({
  prompt: 'select_account' // This forces account selection every time
});

export default app;