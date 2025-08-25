import { db } from './firebase';
import { 
  collection,
  getDocs,
  query,
  where
} from 'firebase/firestore';
import { TermFragment } from './types';

// 機能2: 規約片のタグ付け機能
// ※ createTermFragment と updateTermFragment で tags を配列として保存済み

// 機能3: 規約片のタグでの検索機能
export async function searchTermFragmentsByTag(tag: string): Promise<{
  id: string;
  data: TermFragment;
}[]> {
  const q = query(
    collection(db, 'termFragments'),
    where('tags', 'array-contains', tag)
  );
  
  const querySnapshot = await getDocs(q);
  const results: { id: string; data: TermFragment }[] = [];
  
  querySnapshot.forEach((doc) => {
    results.push({
      id: doc.id,
      data: doc.data() as TermFragment
    });
  });

  return results;
}
