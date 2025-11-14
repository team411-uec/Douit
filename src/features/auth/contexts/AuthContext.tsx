'use client';

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { User } from 'firebase/auth';
import { useFirebase } from '@/providers/FirebaseProvider';
import { ensureUserWithDb } from '@/features/user/services/userService';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const { auth, db, isInitialized } = useFirebase();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Firebaseが初期化されていない場合は何もしない
    if (!isInitialized || !auth || !db) {
      return;
    }

    // Dynamic importでFirebase Auth関数を読み込む
    let unsubscribe: (() => void) | undefined;

    const setupAuthListener = async () => {
      const { onAuthStateChanged } = await import('firebase/auth');

      unsubscribe = onAuthStateChanged(auth, async (user) => {
        if (user) {
          // ユーザーがログインした場合、Firestoreにユーザー情報を保存
          try {
            await ensureUserWithDb(
              db,
              user.uid,
              user.displayName || 'ユーザー',
              user.email || undefined,
            );
          } catch (error) {
            console.error('ユーザー情報の保存に失敗しました:', error);
          }
        }
        setUser(user);
        setLoading(false);
      });
    };

    setupAuthListener();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [auth, db, isInitialized]);

  const signIn = async (email: string, password: string) => {
    if (!auth || !db) {
      throw new Error('Firebase not initialized');
    }
    setLoading(true);
    try {
      const { signInWithEmailAndPassword } = await import('firebase/auth');
      const result = await signInWithEmailAndPassword(auth, email, password);
      // ログイン成功時にFirestoreにユーザー情報を保存
      await ensureUserWithDb(
        db,
        result.user.uid,
        result.user.displayName || 'ユーザー',
        result.user.email || undefined,
      );
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const signUp = async (email: string, password: string) => {
    if (!auth || !db) {
      throw new Error('Firebase not initialized');
    }
    setLoading(true);
    try {
      const { createUserWithEmailAndPassword } = await import('firebase/auth');
      const result = await createUserWithEmailAndPassword(auth, email, password);
      // アカウント作成時にFirestoreにユーザー情報を保存
      await ensureUserWithDb(
        db,
        result.user.uid,
        result.user.displayName || 'ユーザー',
        result.user.email || undefined,
      );
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const signInWithGoogle = async () => {
    if (!auth || !db) {
      throw new Error('Firebase not initialized');
    }
    setLoading(true);
    try {
      const { GoogleAuthProvider, signInWithPopup } = await import('firebase/auth');
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      // Googleログイン成功時にFirestoreにユーザー情報を保存
      await ensureUserWithDb(
        db,
        result.user.uid,
        result.user.displayName || 'ユーザー',
        result.user.email || undefined,
      );
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const logout = async () => {
    if (!auth) {
      throw new Error('Firebase not initialized');
    }
    setLoading(true);
    try {
      const { signOut } = await import('firebase/auth');
      await signOut(auth);
    } finally {
      setLoading(false);
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    signIn,
    signUp,
    signInWithGoogle,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
