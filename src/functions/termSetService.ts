import { db } from "./firebase";
import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { TermSet, FragmentRef } from "../domains/types";

// 機能4: 利用規約セットの作成・管理機能

/**
 * 規約セットの作成（ユーザー指定版）
 */
export async function createUserTermSet(
  userId: string,
  title: string,
  description?: string
): Promise<string> {
  const setData = {
    title,
    description: description || "",
    createdBy: userId,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    currentVersion: 1,
    isPublic: false,
  };

  const docRef = await addDoc(collection(db, "userTermSets"), setData);
  return docRef.id;
}

/**
 * ユーザーの利用規約セット一覧を取得
 */
export async function getUserTermSets(
  userId: string
): Promise<Array<{ id: string; title: string; description: string; createdAt: Date }>> {
  const q = query(collection(db, "userTermSets"), orderBy("createdAt", "desc"));

  const querySnapshot = await getDocs(q);
  const termSets: Array<{
    id: string;
    title: string;
    description: string;
    createdAt: Date;
  }> = [];

  querySnapshot.forEach(doc => {
    const data = doc.data();
    if (data.createdBy === userId) {
      termSets.push({
        id: doc.id,
        title: data.title,
        description: data.description,
        createdAt: data.createdAt?.toDate() || new Date(),
      });
    }
  });

  return termSets;
}

/**
 * 規約セットにフラグメントを追加
 */
export async function addFragmentToSet(
  termSetId: string,
  fragmentId: string,
  parameterValues: Record<string, string>,
  order?: number
): Promise<void> {
  const fragmentsCollection = collection(db, "userTermSets", termSetId, "fragments");

  // orderが指定されない場合、最後に追加
  if (order === undefined) {
    const existingFragments = await getDocs(query(fragmentsCollection, orderBy("order", "desc")));
    order = existingFragments.empty ? 1 : (existingFragments.docs[0].data().order as number) + 1;
  }

  const fragmentRef: FragmentRef = {
    fragmentId,
    order,
    parameterValues,
  };

  await addDoc(fragmentsCollection, fragmentRef);

  // 親セットの更新日時を更新
  await updateDoc(doc(db, "userTermSets", termSetId), {
    updatedAt: serverTimestamp(),
  });
}

/**
 * 規約セットの取得（フラグメント含む）
 */
export async function getTermSetWithFragments(termSetId: string): Promise<{
  set: TermSet & { id: string };
  fragments: (FragmentRef & { id: string })[];
} | null> {
  const setDoc = await getDoc(doc(db, "termSets", termSetId));

  if (!setDoc.exists()) {
    return null;
  }

  const fragmentsSnapshot = await getDocs(
    query(collection(db, "termSets", termSetId, "fragments"), orderBy("order", "asc"))
  );

  const fragments = fragmentsSnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  })) as (FragmentRef & { id: string })[];

  return {
    set: { id: setDoc.id, ...setDoc.data() } as TermSet & { id: string },
    fragments,
  };
}

/**
 * ユーザー規約セットの詳細取得（フラグメント含む）
 */
export async function getUserTermSetWithFragments(termSetId: string): Promise<{
  set: any;
  fragments: any[];
} | null> {
  const setDoc = await getDoc(doc(db, "userTermSets", termSetId));

  if (!setDoc.exists()) {
    return null;
  }

  const fragmentsSnapshot = await getDocs(
    query(collection(db, "userTermSets", termSetId, "fragments"), orderBy("order", "asc"))
  );

  const fragments = fragmentsSnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  }));

  return {
    set: { id: setDoc.id, ...setDoc.data() },
    fragments,
  };
}
