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
import { TermSet, FragmentRef, ApiResult } from "@/types";
import {
  handleError,
  createErrorResult,
  createSuccessResult,
  logError,
} from "@/utils/errorHandler";

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

export async function getUserTermSets(
  userId: string
): Promise<ApiResult<Array<{ id: string; title: string; description: string; createdAt: Date }>>> {
  try {
    const q = query(collection(db, "userTermSets"), orderBy("createdAt", "desc"));

    const querySnapshot = await getDocs(q);
    const termSets: Array<{
      id: string;
      title: string;
      description: string;
      createdAt: Date;
    }> = [];

    querySnapshot.forEach(doc => {
      const data = doc.data() as {
        createdBy: string;
        title: string;
        description: string;
        createdAt?: { toDate(): Date };
      };
      if (data.createdBy === userId) {
        termSets.push({
          id: doc.id,
          title: data.title,
          description: data.description,
          createdAt: data.createdAt?.toDate() || new Date(),
        });
      }
    });

    return createSuccessResult(termSets);
  } catch (error) {
    const appError = handleError(error);
    logError(appError, "getUserTermSets");
    return createErrorResult(appError);
  }
}

export async function createTermSet(
  title: string = "新しい規約セット",
  userId: string = "system"
): Promise<ApiResult<string>> {
  try {
    const setData: Omit<TermSet, "id"> = {
      title,
      userId,
      createdAt: new Date(),
      updatedAt: new Date(),
      currentVersion: 1,
    };

    const docRef = await addDoc(collection(db, "termSets"), {
      ...setData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    return createSuccessResult(docRef.id);
  } catch (error) {
    const appError = handleError(error);
    logError(appError, "createTermSet");
    return createErrorResult(appError);
  }
}

export async function addFragmentToSet(
  termSetId: string,
  fragmentId: string,
  parameterValues: Record<string, string>,
  order?: number
): Promise<void> {
  const fragmentsCollection = collection(db, "userTermSets", termSetId, "fragments");

  if (order === undefined) {
    const existingFragments = await getDocs(query(fragmentsCollection, orderBy("order", "desc")));
    if (existingFragments.empty) {
      order = 1;
    } else {
      const firstDoc = existingFragments.docs[0];
      const data = firstDoc?.data() as { order?: number };
      order = (data?.order || 0) + 1;
    }
  }

  const fragmentRef: FragmentRef = {
    fragmentId,
    order,
    parameterValues,
  };

  await addDoc(fragmentsCollection, fragmentRef);

  await updateDoc(doc(db, "userTermSets", termSetId), {
    updatedAt: serverTimestamp(),
  });
}

export async function getUserTermSetWithFragments(termSetId: string): Promise<{
  set: TermSet | null;
  fragments: FragmentRef[];
} | null> {
  const setDoc = await getDoc(doc(db, "userTermSets", termSetId));

  if (!setDoc.exists()) {
    return null;
  }

  const fragmentsSnapshot = await getDocs(
    query(collection(db, "userTermSets", termSetId, "fragments"), orderBy("order", "asc"))
  );

  const fragments = fragmentsSnapshot.docs.map(doc => {
    const data = doc.data() as {
      fragmentId?: string;
      order?: number;
      parameterValues?: Record<string, unknown>;
    };
    return {
      fragmentId: data.fragmentId || doc.id,
      order: data.order || 0,
      parameterValues: data.parameterValues || {},
    } as FragmentRef;
  });

  return {
    set: { id: setDoc.id, ...setDoc.data() } as TermSet,
    fragments: fragments as FragmentRef[],
  };
}
