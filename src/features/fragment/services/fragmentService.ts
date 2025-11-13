import { db } from '@/lib/firebase';
import { collection, doc, addDoc, updateDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import type { TermFragment } from '../types';

// 規約片の作成
export async function createTermFragment(
  title: string,
  content: string,
  tags: string[],
  parameters: string[],
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

  const docRef = await addDoc(collection(db, 'termFragments'), fragmentData);
  return docRef.id;
}

// 規約片の編集
export async function updateTermFragment(
  fragmentId: string,
  title: string,
  content: string,
  tags: string[],
  parameters: string[],
): Promise<void> {
  const fragmentRef = doc(db, 'termFragments', fragmentId);
  const fragmentDoc = await getDoc(fragmentRef);

  if (!fragmentDoc.exists()) {
    throw new Error('規約片が見つかりません');
  }

  const currentData = fragmentDoc.data();

  // 現在のバージョンを履歴に保存
  await addDoc(collection(db, 'termFragments', fragmentId, 'versions'), {
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

// 規約片の取得
export async function getTermFragment(fragmentId: string): Promise<TermFragment | null> {
  const fragmentRef = doc(db, 'termFragments', fragmentId);
  const fragmentDoc = await getDoc(fragmentRef);

  if (!fragmentDoc.exists()) {
    return null;
  }

  return { id: fragmentId, ...fragmentDoc.data() } as TermFragment;
}
