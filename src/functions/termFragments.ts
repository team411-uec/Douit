import { db } from "./firebase";
import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  getDocs,
  query,
  where,
  collectionGroup,
  serverTimestamp,
} from "firebase/firestore";
import { TermFragment } from "../types";

// 規約片の作成
export async function createTermFragment(
  title: string,
  content: string,
  tags: string[],
  parameters: string[]
): Promise<string> {
  const fragmentData = {
    title,
    content,
    parameters,
    tags,
    currentVersion: 1,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  const docRef = await addDoc(collection(db, "termFragments"), fragmentData);
  return docRef.id;
}

// 規約片の編集
export async function updateTermFragment(
  fragmentId: string,
  title: string,
  content: string,
  tags: string[],
  parameters: string[]
): Promise<void> {
  const fragmentRef = doc(db, "termFragments", fragmentId);
  const fragmentDoc = await getDoc(fragmentRef);

  if (!fragmentDoc.exists()) {
    throw new Error("規約片が見つかりません");
  }

  const currentData = fragmentDoc.data();

  // 現在のバージョンを履歴に保存
  await addDoc(collection(db, "termFragments", fragmentId, "versions"), {
    title: currentData.title,
    content: currentData.content,
    parameters: currentData.parameters,
    tags: currentData.tags,
    createdAt: currentData.createdAt,
    updatedAt: currentData.updatedAt,
  });

  // 親ドキュメント更新
  await updateDoc(fragmentRef, {
    title,
    content,
    parameters,
    tags,
    currentVersion: currentData.currentVersion + 1,
    updatedAt: serverTimestamp(),
  });
}

// 規約片を参照している規約セットを検索
export async function findReferencingSets(fragmentId: string): Promise<
  {
    setId: string;
    setTitle?: string;
  }[]
> {
  const q = query(collectionGroup(db, "fragments"), where("fragmentId", "==", fragmentId));

  const querySnapshot = await getDocs(q);
  const referencingSets: { setId: string; setTitle?: string }[] = [];

  querySnapshot.forEach(doc => {
    const pathParts = doc.ref.path.split("/");
    const setId = pathParts[1];
    referencingSets.push({ setId });
  });

  return referencingSets;
}

// 安全な削除関数（警告付き）
async function safeDeleteTermFragment(
  fragmentId: string,
  forceDelete: boolean = false
): Promise<{
  success: boolean;
  referencingSets?: { setId: string; setTitle?: string }[];
  message: string;
}> {
  const referencingSets = await findReferencingSets(fragmentId);

  if (referencingSets.length > 0 && !forceDelete) {
    return {
      success: false,
      referencingSets,
      message: `この規約片は${referencingSets.length}個の規約セットで使用されています。削除を続行しますか？`,
    };
  }

  await deleteTermFragment(fragmentId);

  return {
    success: true,
    message: "規約片を削除しました",
  };
}

// 基本的な削除関数
export async function deleteTermFragment(fragmentId: string): Promise<void> {
  const fragmentRef = doc(db, "termFragments", fragmentId);
  await deleteDoc(fragmentRef);
}

// 規約片の取得
export async function getTermFragment(fragmentId: string): Promise<TermFragment | null> {
  const fragmentRef = doc(db, "termFragments", fragmentId);
  const fragmentDoc = await getDoc(fragmentRef);

  if (!fragmentDoc.exists()) {
    return null;
  }

  return { id: fragmentId, ...fragmentDoc.data() } as TermFragment;
}
