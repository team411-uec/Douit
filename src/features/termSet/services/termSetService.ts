import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { FragmentRef, TermSet } from '../types';

export async function createTermSet(
  userId: string,
  title: string,
  description?: string,
): Promise<string> {
  const setData = {
    title,
    description: description || '',
    createdBy: userId,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    currentVersion: 1,
    isPublic: false,
  };

  const docRef = await addDoc(collection(db, 'term_sets'), setData);
  return docRef.id;
}

export async function getTermSetsOf(userId: string): Promise<TermSet[]> {
  const q = query(collection(db, 'term_sets'), orderBy('createdAt', 'desc'));
  const querySnapshot = await getDocs(q);
  const termSets: TermSet[] = [];

  querySnapshot.forEach((doc) => {
    const data = doc.data();
    if (data.createdBy === userId) {
      termSets.push({
        id: doc.id,
        ...data,
      } as TermSet);
    }
  });

  return termSets;
}

export async function addFragmentToSet(
  termSetId: string,
  fragmentId: string,
  parameterValues: Record<string, string>,
  order?: number,
): Promise<void> {
  const fragmentsCollection = collection(db, 'term_sets', termSetId, 'fragments');

  if (order === undefined) {
    const existingFragments = await getDocs(query(fragmentsCollection, orderBy('order', 'desc')));
    order = existingFragments.empty ? 1 : (existingFragments.docs[0].data().order as number) + 1;
  }

  const fragmentRef: FragmentRef = {
    fragmentId,
    order,
    parameterValues,
  };

  await addDoc(fragmentsCollection, fragmentRef);

  await updateDoc(doc(db, 'term_sets', termSetId), {
    updatedAt: serverTimestamp(),
  });
}

export async function getTermSet(termSetId: string): Promise<TermSet> {
  const setDoc = await getDoc(doc(db, 'term_sets', termSetId));

  return {
    id: setDoc.id,
    ...setDoc.data(),
  } as TermSet;
}

export async function getTermSetWithFragments(
  termSetId: string,
): Promise<(TermSet & { fragments: FragmentRef[] }) | null> {
  const termSet = await getTermSet(termSetId);
  if (!termSet) {
    return null;
  }

  const fragmentsQuery = query(
    collection(db, 'term_sets', termSetId, 'fragments'),
    orderBy('order'),
  );
  const fragmentsSnapshot = await getDocs(fragmentsQuery);
  const fragments = fragmentsSnapshot.docs.map(
    (doc) => ({ fragmentId: doc.id, ...doc.data() }) as FragmentRef,
  );

  return { ...termSet, fragments };
}
