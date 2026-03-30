// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from 'firebase/storage'
import { getAnalytics, isSupported } from "firebase/analytics";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCwwSp_Y8IsfAEctbSwVV9tepjnC7UxTDU",
  authDomain: "nciplibrarysystem.firebaseapp.com",
  databaseURL: "https://nciplibrarysystem-default-rtdb.firebaseio.com",
  projectId: "nciplibrarysystem",
  storageBucket: "nciplibrarysystem.firebasestorage.app",
  messagingSenderId: "41133429080",
  appId: "1:41133429080:web:52a8822812297254e6552d",
  measurementId: "G-Q1PYJXPPVT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Initialize Analytics only in browser environment
export const analytics = typeof window !== 'undefined' ? isSupported().then(yes => yes ? getAnalytics(app) : null) : null;

export default app;
