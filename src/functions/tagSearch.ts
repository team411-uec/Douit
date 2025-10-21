import { db } from "./firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { TermFragment } from "../types";

// 機能2: 規約片のタグ付け機能
// ※ createTermFragment と updateTermFragment で tags を配列として保存済み

// 機能3: 規約片のタグでの検索機能
export async function searchTermFragmentsByTag(tag: string): Promise<
  {
    id: string;
    data: TermFragment;
  }[]
> {
  const q = query(collection(db, "termFragments"), where("tags", "array-contains", tag));

  const querySnapshot = await getDocs(q);
  const results: { id: string; data: TermFragment }[] = [];

  querySnapshot.forEach(doc => {
    results.push({
      id: doc.id,
      data: doc.data() as TermFragment,
    });
  });

  return results;
}

// 全ての規約片を取得する機能（タグ指定なし）
export async function getAllTermFragments(): Promise<
  {
    id: string;
    data: TermFragment;
  }[]
> {
  const querySnapshot = await getDocs(collection(db, "termFragments"));
  const results: { id: string; data: TermFragment }[] = [];

  querySnapshot.forEach(doc => {
    results.push({
      id: doc.id,
      data: doc.data() as TermFragment,
    });
  });

  return results;
}

// 統合検索機能：タグ指定ありなしを統一したインターフェース
export async function searchTermFragments(tag?: string): Promise<
  {
    id: string;
    data: TermFragment;
  }[]
> {
  if (!tag || tag.trim() === "") {
    // タグが指定されていない場合は全ての規約片を返す
    return getAllTermFragments();
  } else {
    // タグが指定されている場合はタグ検索を実行
    return searchTermFragmentsByTag(tag.trim());
  }
}
