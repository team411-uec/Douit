// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getAnalytics, isSupported } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAoZkSyD7a6-T1aBf0TiXJNNnbhGSUYZ9Q",
  authDomain: "douit-d488e.firebaseapp.com",
  projectId: "douit-d488e",
  storageBucket: "douit-d488e.firebasestorage.app",
  messagingSenderId: "723041762423",
  appId: "1:723041762423:web:8be43af9ee6f4dda53da72",
  measurementId: "G-RTJQ1T0ZF5",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore Database
export const db = getFirestore(app);

// Initialize Firebase Auth
export const auth = getAuth(app);

// Initialize Analytics (only on client side)
let analytics;
if (typeof window !== "undefined") {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  });
}
