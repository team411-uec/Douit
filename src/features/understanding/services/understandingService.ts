import { db } from '@/lib/firebase';
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';
import type { UnderstoodRecord } from '@/types';

// 機能6: 理解済み規約片の識別表示機能
// 機能7: 利用規約の理解（understood）の記録機能
// 機能8: 理解済み規約片の一覧確認機能

/**
 * 理解記録の追加
 */
export async function addUnderstoodRecord(
  userId: string,
  fragmentId: string,
  version: number,
): Promise<string> {
  // 既に同じフラグメントIDとバージョンの記録が存在するかチェック
  const existingQuery = query(
    collection(db, 'users', userId, 'understood'),
    where('fragmentId', '==', fragmentId),
    where('version', '==', version),
  );

  const existingSnapshot = await getDocs(existingQuery);

  if (!existingSnapshot.empty) {
    throw new Error('この規約片のバージョンは既に理解済みとして記録されています');
  }

  const recordData: Omit<UnderstoodRecord, 'id'> = {
    fragmentId,
    version,
    understoodAt: new Date(),
  };

  const docRef = await addDoc(collection(db, 'users', userId, 'understood'), {
    ...recordData,
    understoodAt: serverTimestamp(),
  });

  return docRef.id;
}

/**
 * 理解記録の削除
 */
export async function removeUnderstoodRecord(userId: string, fragmentId: string): Promise<void> {
  const q = query(
    collection(db, 'users', userId, 'understood'),
    where('fragmentId', '==', fragmentId),
  );

  const querySnapshot = await getDocs(q);

  // 該当する記録をすべて削除
  const deletePromises = querySnapshot.docs.map((doc) => deleteDoc(doc.ref));
  await Promise.all(deletePromises);
}

/**
 * ユーザーの理解記録を取得
 */
export async function getUserUnderstoodRecords(userId: string): Promise<UnderstoodRecord[]> {
  const querySnapshot = await getDocs(
    query(collection(db, 'users', userId, 'understood'), orderBy('understoodAt', 'desc')),
  );

  return querySnapshot.docs.map((doc) => ({
    ...doc.data(),
  })) as UnderstoodRecord[];
}

/**
 * 特定のフラグメントを理解しているかチェック
 */
export async function isFragmentUnderstood(
  userId: string,
  fragmentId: string,
  version?: number,
): Promise<boolean> {
  let q = query(
    collection(db, 'users', userId, 'understood'),
    where('fragmentId', '==', fragmentId),
  );

  if (version !== undefined) {
    q = query(q, where('version', '==', version));
  }

  const querySnapshot = await getDocs(q);
  return !querySnapshot.empty;
}

/**
 * 特定の規約セット内での理解状況を取得
 */
export async function getUnderstandingStatusForSet(
  userId: string,
  termSetId: string,
): Promise<
  {
    fragmentId: string;
    isUnderstood: boolean;
    understoodAt?: Date;
    version?: number;
  }[]
> {
  const { getTermSetWithFragments } = await import('@/features/termSet/services/termSetService');
  const termSetData = await getTermSetWithFragments(termSetId);

  if (!termSetData) {
    return [];
  }

  const understoodRecords = await getUserUnderstoodRecords(userId);
  const understoodMap = new Map(understoodRecords.map((record) => [record.fragmentId, record]));

  return termSetData.fragments.map((fragmentRef) => {
    const understood = understoodMap.get(fragmentRef.fragmentId);
    return {
      fragmentId: fragmentRef.fragmentId,
      isUnderstood: !!understood,
      understoodAt: understood?.understoodAt,
      version: understood?.version,
    };
  });
}
