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

  apiKey: "AIzaSyBoSPj1fd2-EvbX70cWv5fxQarBdt8k0HQ",
  authDomain: "todolist-4c316.firebaseapp.com",
  databaseURL: "https://todolist-4c316-default-rtdb.firebaseio.com", // Make sure this is correct
  projectId: "todolist-4c316",
  storageBucket: "todolist-4c316.firebasestorage.app",
  messagingSenderId: "145271165749",
  appId: "1:145271165749:web:7f2e15e932b3876c4af27c"
};

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