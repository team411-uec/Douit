import { db } from './firebase';
import { 
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  serverTimestamp,
  writeBatch,
  runTransaction
} from 'firebase/firestore';
import { TermSet, FragmentRef, TermSetVersion } from '../../types';

// 機能4: 利用規約セットの作成・管理機能

/**
 * 規約セットの作成
 */
export async function createTermSet(): Promise<string> {
  const setData: Omit<TermSet, 'id'> = {
    createdAt: new Date(),
    updatedAt: new Date(),
    currentVersion: 1
  };

  const docRef = await addDoc(collection(db, 'termSets'), {
    ...setData,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });
  
  return docRef.id;
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
  const fragmentsCollection = collection(db, 'termSets', termSetId, 'fragments');
  
  // orderが指定されない場合、最後に追加
  if (order === undefined) {
    const existingFragments = await getDocs(query(fragmentsCollection, orderBy('order', 'desc')));
    order = existingFragments.empty ? 1 : (existingFragments.docs[0].data().order as number) + 1;
  }

  const fragmentRef: FragmentRef = {
    fragmentId,
    order,
    parameterValues
  };

  await addDoc(fragmentsCollection, fragmentRef);
  
  // 親セットの更新日時を更新
  await updateDoc(doc(db, 'termSets', termSetId), {
    updatedAt: serverTimestamp()
  });
}

/**
 * フラグメントの並べ替え
 */
export async function reorderFragments(
  termSetId: string,
  fragmentOrders: { fragmentRefId: string; newOrder: number }[]
): Promise<void> {
  const batch = writeBatch(db);
  
  fragmentOrders.forEach(({ fragmentRefId, newOrder }) => {
    const fragmentRef = doc(db, 'termSets', termSetId, 'fragments', fragmentRefId);
    batch.update(fragmentRef, { order: newOrder });
  });
  
  // 親セットの更新日時を更新
  const setRef = doc(db, 'termSets', termSetId);
  batch.update(setRef, { updatedAt: serverTimestamp() });
  
  await batch.commit();
}

/**
 * 規約セットの編集（バージョン管理付き）
 */
export async function updateTermSet(
  termSetId: string,
  fragments: { fragmentId: string; order: number; parameterValues: Record<string, string> }[]
): Promise<void> {
  await runTransaction(db, async (transaction) => {
    const setRef = doc(db, 'termSets', termSetId);
    const setDoc = await transaction.get(setRef);
    
    if (!setDoc.exists()) {
      throw new Error('Term set not found');
    }

    const currentData = setDoc.data() as TermSet;
    
    // 現在のバージョンを履歴に保存
    const versionRef = doc(collection(setRef, 'versions'), currentData.currentVersion.toString());
    const versionData: TermSetVersion = {
      createdAt: currentData.updatedAt
    };
    transaction.set(versionRef, versionData);
    
    // 現在のフラグメントを履歴のサブコレクションにコピー
    const currentFragments = await getDocs(collection(db, 'termSets', termSetId, 'fragments'));
    currentFragments.forEach((fragmentDoc) => {
      const versionFragmentRef = doc(collection(versionRef, 'fragments'), fragmentDoc.id);
      transaction.set(versionFragmentRef, fragmentDoc.data());
    });
    
    // 既存のフラグメントを削除
    currentFragments.forEach((fragmentDoc) => {
      transaction.delete(fragmentDoc.ref);
    });
    
    // 新しいフラグメントを追加
    fragments.forEach((fragment, index) => {
      const newFragmentRef = doc(collection(setRef, 'fragments'));
      transaction.set(newFragmentRef, fragment);
    });
    
    // 親セットを更新
    transaction.update(setRef, {
      updatedAt: serverTimestamp(),
      currentVersion: currentData.currentVersion + 1
    });
  });
}

/**
 * 規約セットの取得（フラグメント含む）
 */
export async function getTermSetWithFragments(termSetId: string): Promise<{
  set: TermSet & { id: string };
  fragments: (FragmentRef & { id: string })[];
} | null> {
  const setDoc = await getDoc(doc(db, 'termSets', termSetId));
  
  if (!setDoc.exists()) {
    return null;
  }

  const fragmentsSnapshot = await getDocs(
    query(collection(db, 'termSets', termSetId, 'fragments'), orderBy('order', 'asc'))
  );
  
  const fragments = fragmentsSnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as (FragmentRef & { id: string })[];

  return {
    set: { id: setDoc.id, ...setDoc.data() } as TermSet & { id: string },
    fragments
  };
}

/**
 * 規約セットの削除
 */
export async function deleteTermSet(termSetId: string): Promise<void> {
  const batch = writeBatch(db);
  
  // フラグメントを削除
  const fragmentsSnapshot = await getDocs(collection(db, 'termSets', termSetId, 'fragments'));
  fragmentsSnapshot.docs.forEach(doc => {
    batch.delete(doc.ref);
  });
  
  // セット本体を削除
  batch.delete(doc(db, 'termSets', termSetId));
  
  await batch.commit();
}

/**
 * レンダリング済み規約セットの取得（プレビュー/公開表示用）
 */
export async function getRenderedTermSet(termSetId: string): Promise<{
  fragments: { title: string; renderedContent: string; order: number }[];
} | null> {
  const termSetData = await getTermSetWithFragments(termSetId);
  
  if (!termSetData) {
    return null;
  }

  const { getTermFragment } = await import('./termFragments');
  const renderedFragments = [];
  
  // 正規表現文字をエスケープするヘルパー関数
  function escapeRegExp(string: string): string {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
  
  for (const fragmentRef of termSetData.fragments) {
    const fragment = await getTermFragment(fragmentRef.fragmentId);
    
    if (fragment) {
      let renderedContent = fragment.content;
      
      // パラメータ値を適用してプレースホルダーを置換
      Object.entries(fragmentRef.parameterValues).forEach(([param, value]) => {
        const placeholder = `[${param}]`;
        renderedContent = renderedContent.replace(new RegExp(escapeRegExp(placeholder), 'g'), value);
      });
      
      renderedFragments.push({
        title: fragment.title,
        renderedContent,
        order: fragmentRef.order
      });
    }
  }
  
  return { fragments: renderedFragments };
}
