import { db } from './firebase';
import { 
  collection,
  doc,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  serverTimestamp
} from 'firebase/firestore';
import { UnderstoodRecord, TermFragment } from './types';

// 機能6: 理解済み規約片の識別表示機能
// 機能7: 利用規約の理解（understood）の記録機能
// 機能8: 理解済み規約片の一覧確認機能

/**
 * 理解記録の追加
 */
export async function addUnderstoodRecord(
  userId: string,
  fragmentId: string,
  version: number
): Promise<string> {
  const recordData: Omit<UnderstoodRecord, 'id'> = {
    fragmentId,
    version,
    understoodAt: new Date()
  };

  const docRef = await addDoc(
    collection(db, 'users', userId, 'understood'),
    {
      ...recordData,
      understoodAt: serverTimestamp()
    }
  );
  
  return docRef.id;
}

/**
 * ユーザーの理解記録を取得
 */
export async function getUserUnderstoodRecords(userId: string): Promise<(UnderstoodRecord & { id: string })[]> {
  const querySnapshot = await getDocs(
    query(
      collection(db, 'users', userId, 'understood'),
      orderBy('understoodAt', 'desc')
    )
  );
  
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as (UnderstoodRecord & { id: string })[];
}

/**
 * 特定のフラグメントを理解しているかチェック
 */
export async function isFragmentUnderstood(
  userId: string,
  fragmentId: string,
  version?: number
): Promise<boolean> {
  let q = query(
    collection(db, 'users', userId, 'understood'),
    where('fragmentId', '==', fragmentId)
  );
  
  if (version !== undefined) {
    q = query(q, where('version', '==', version));
  }
  
  const querySnapshot = await getDocs(q);
  return !querySnapshot.empty;
}

/**
 * 理解済みフラグメントIDのセットを取得（高速化用）
 */
export async function getUnderstoodFragmentIds(userId: string): Promise<Set<string>> {
  const records = await getUserUnderstoodRecords(userId);
  return new Set(records.map(record => record.fragmentId));
}

/**
 * 理解記録一覧（フラグメント情報付き）を取得
 */
export async function getUnderstoodRecordsWithFragments(userId: string): Promise<{
  record: UnderstoodRecord & { id: string };
  fragment: TermFragment | null;
}[]> {
  const records = await getUserUnderstoodRecords(userId);
  const { getTermFragment } = await import('./termFragments');
  
  const recordsWithFragments = [];
  
  for (const record of records) {
    const fragment = await getTermFragment(record.fragmentId);
    recordsWithFragments.push({
      record,
      fragment
    });
  }
  
  return recordsWithFragments;
}

/**
 * 特定の規約セット内での理解状況を取得
 */
export async function getUnderstandingStatusForSet(
  userId: string,
  termSetId: string
): Promise<{
  fragmentId: string;
  isUnderstood: boolean;
  understoodAt?: Date;
  version?: number;
}[]> {
  const { getTermSetWithFragments } = await import('./termSetService');
  const termSetData = await getTermSetWithFragments(termSetId);
  
  if (!termSetData) {
    return [];
  }
  
  const understoodRecords = await getUserUnderstoodRecords(userId);
  const understoodMap = new Map(
    understoodRecords.map(record => [record.fragmentId, record])
  );
  
  return termSetData.fragments.map(fragmentRef => {
    const understood = understoodMap.get(fragmentRef.fragmentId);
    return {
      fragmentId: fragmentRef.fragmentId,
      isUnderstood: !!understood,
      understoodAt: understood?.understoodAt,
      version: understood?.version
    };
  });
}
