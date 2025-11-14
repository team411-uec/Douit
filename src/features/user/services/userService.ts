import type { Firestore } from 'firebase/firestore';
import type { User } from '@/types';

/**
 * ユーザーが存在しない場合は作成する
 */
export async function ensureUserWithDb(
  db: Firestore,
  userId: string,
  name: string,
  email?: string,
): Promise<void> {
  const { doc, getDoc, setDoc, serverTimestamp } = await import('firebase/firestore');

  const userDocRef = doc(db, 'users', userId);
  const userDoc = await getDoc(userDocRef);

  if (!userDoc.exists()) {
    const userData: Omit<User, 'id'> = {
      name,
      email: email || '',
      createdAt: new Date(),
    };

    await setDoc(userDocRef, {
      ...userData,
      createdAt: serverTimestamp(),
    });
  }
}
