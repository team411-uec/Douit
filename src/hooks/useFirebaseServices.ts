'use client';

import { useFirebase } from '@/providers/FirebaseProvider';

/**
 * Firebaseサービス（auth, db）を取得するカスタムフック
 * 各コンポーネントやカスタムフックから使用する
 */
export function useFirebaseServices() {
  const { auth, db, isInitialized } = useFirebase();

  if (!isInitialized || !auth || !db) {
    throw new Error('Firebase is not initialized yet');
  }

  return { auth, db };
}
