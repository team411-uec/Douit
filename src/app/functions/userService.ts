import { db } from './firebase';
import { 
  collection,
  doc,
  addDoc,
  getDoc,
  updateDoc,
  serverTimestamp
} from 'firebase/firestore';
import { User } from './types';

/**
 * ユーザーの作成
 */
export async function createUser(
  userId: string,
  name: string,
  email: string
): Promise<void> {
  const userData: Omit<User, 'id'> = {
    name,
    email,
    createdAt: new Date()
  };

  await doc(db, 'users', userId);
  await updateDoc(doc(db, 'users', userId), {
    ...userData,
    createdAt: serverTimestamp()
  });
}

/**
 * ユーザー情報の取得
 */
export async function getUser(userId: string): Promise<User | null> {
  const userDoc = await getDoc(doc(db, 'users', userId));
  
  if (!userDoc.exists()) {
    return null;
  }

  return userDoc.data() as User;
}

/**
 * ユーザー情報の更新
 */
export async function updateUser(
  userId: string,
  updates: Partial<Pick<User, 'name' | 'email'>>
): Promise<void> {
  await updateDoc(doc(db, 'users', userId), updates);
}
