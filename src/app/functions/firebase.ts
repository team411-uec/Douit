// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAoZkSyD7a6-T1aBf0TiXJNNnbhGSUYZ9Q",
  authDomain: "douit-d488e.firebaseapp.com",
  projectId: "douit-d488e",
  storageBucket: "douit-d488e.firebasestorage.app",
  messagingSenderId: "723041762423",
  appId: "1:723041762423:web:8be43af9ee6f4dda53da72",
  measurementId: "G-RTJQ1T0ZF5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);