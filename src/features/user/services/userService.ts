import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

/**
 * ユーザーが存在しない場合は作成する
 */
export async function ensureUser(userId: string, name: string, email?: string): Promise<void> {
  const userDocRef = doc(db, 'users', userId);
  const userDoc = await getDoc(userDocRef);

  if (!userDoc.exists()) {
    const userData = {
      name,
      email: email || '',
    };

    await setDoc(userDocRef, {
      ...userData,
      createdAt: serverTimestamp(),
    });
  }
}
