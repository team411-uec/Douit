'use client';

import type { FirebaseApp } from 'firebase/app';
import type { Auth } from 'firebase/auth';
import type { Firestore } from 'firebase/firestore';
import { createContext, type ReactNode, useContext, useEffect, useState } from 'react';
import { getFirebaseConfig } from '@/lib/firebase';

interface FirebaseContextType {
  app: FirebaseApp | null;
  auth: Auth | null;
  db: Firestore | null;
  isInitialized: boolean;
}

const FirebaseContext = createContext<FirebaseContextType | undefined>(undefined);

export const useFirebase = () => {
  const context = useContext(FirebaseContext);
  if (context === undefined) {
    throw new Error('useFirebase must be used within a FirebaseProvider');
  }
  // サーバーサイドまたは初期化前の場合はnullを返すバージョンを返す
  return {
    app: context.app,
    auth: context.auth,
    db: context.db,
    isInitialized: context.isInitialized,
  };
};

interface FirebaseProviderProps {
  children: ReactNode;
}

export const FirebaseProvider = ({ children }: FirebaseProviderProps) => {
  const [firebaseState, setFirebaseState] = useState<FirebaseContextType>({
    app: null,
    auth: null,
    db: null,
    isInitialized: false,
  });

  useEffect(() => {
    // Dynamic importでクライアントサイドのみでFirebase SDKを読み込む
    const initializeFirebase = async () => {
      try {
        const [{ initializeApp }, { getAuth }, { getFirestore }] = await Promise.all([
          import('firebase/app'),
          import('firebase/auth'),
          import('firebase/firestore'),
        ]);

        const config = getFirebaseConfig();
        const app = initializeApp(config);
        const auth = getAuth(app);
        const db = getFirestore(app);

        setFirebaseState({
          app,
          auth,
          db,
          isInitialized: true,
        });
      } catch (error) {
        console.error('Firebase initialization failed:', error);
        throw error;
      }
    };

    initializeFirebase();
  }, []);

  // 初期化完了前はローディング表示
  if (!firebaseState.isInitialized) {
    return <div>Loading...</div>;
  }

  return <FirebaseContext.Provider value={firebaseState}>{children}</FirebaseContext.Provider>;
};
