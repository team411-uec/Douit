// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getAnalytics, isSupported } from "firebase/analytics";

// 🌐 通信状況ログ機能
export const networkLogger = {
  log: (action: string, details: any = {}) => {
    const timestamp = new Date().toISOString();
    console.log(`🌐 [NETWORK] ${timestamp} - ${action}`, details);
  },
  error: (action: string, error: any) => {
    const timestamp = new Date().toISOString();
    console.error(`❌ [NETWORK ERROR] ${timestamp} - ${action}`, {
      error: error.message || error,
      code: error.code,
      stack: error.stack,
      name: error.name
    });
  },
  success: (action: string, details: any = {}) => {
    const timestamp = new Date().toISOString();
    console.log(`✅ [NETWORK SUCCESS] ${timestamp} - ${action}`, details);
  },
  connection: (status: 'attempting' | 'connected' | 'disconnected', details: any = {}) => {
    const timestamp = new Date().toISOString();
    const emoji = status === 'attempting' ? '🔄' : status === 'connected' ? '🟢' : '🔴';
    console.log(`${emoji} [CONNECTION] ${timestamp} - ${status.toUpperCase()}`, details);
  }
};

// Your web app's Firebase configuration
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
networkLogger.log('Firebase アプリ初期化開始', firebaseConfig);
const app = initializeApp(firebaseConfig);
networkLogger.success('Firebase アプリ初期化完了', { appName: app.name });

// Initialize Firestore Database with error handling
networkLogger.log('Firestore データベース初期化開始');
export const db = getFirestore(app);

// Development mode での接続確認
if (typeof window !== 'undefined') {
  networkLogger.log('Firestore接続テスト開始', {
    projectId: firebaseConfig.projectId,
    online: navigator.onLine
  });
}

networkLogger.success('Firestore データベース初期化完了', { projectId: firebaseConfig.projectId });

// Initialize Analytics (only on client side)
let analytics;
if (typeof window !== 'undefined') {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  });
}