import { db } from "../repositories/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { TermFragment } from "../domains/types";

// 統合検索機能：タグ指定ありなしを統一したインターフェース
export async function searchTermFragments(tag?: string): Promise<TermFragment[]> {
  const termFragmentsRef = collection(db, "termFragments");
  const q =
    tag && tag.trim() !== ""
      ? query(termFragmentsRef, where("tags", "array-contains", tag.trim()))
      : query(termFragmentsRef);

  const querySnapshot = await getDocs(q);
  const results: TermFragment[] = [];

  querySnapshot.forEach(doc => {
    results.push({
      id: doc.id,
      ...doc.data(),
    } as TermFragment);
  });

  return results;
}
