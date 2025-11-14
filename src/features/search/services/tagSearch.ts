import type { Firestore } from 'firebase/firestore';
import type { TermFragment } from '@/types';

// 統合検索機能：タグ指定ありなしを統一したインターフェース
export async function searchTermFragments(db: Firestore, tag?: string): Promise<TermFragment[]> {
  const { collection, getDocs, query, where } = await import('firebase/firestore');

  const termFragmentsRef = collection(db, 'termFragments');
  const q =
    tag && tag.trim() !== ''
      ? query(termFragmentsRef, where('tags', 'array-contains', tag.trim()))
      : query(termFragmentsRef);

  const querySnapshot = await getDocs(q);
  const results: TermFragment[] = [];

  querySnapshot.forEach((doc) => {
    results.push({
      id: doc.id,
      ...doc.data(),
    } as TermFragment);
  });

  return results;
}
