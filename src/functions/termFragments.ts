import { db } from "./firebase";
import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  serverTimestamp,
} from "firebase/firestore";
import { TermFragment, ApiResult } from "@/types";
import {
  handleError,
  createErrorResult,
  createSuccessResult,
  logError,
} from "@/utils/errorHandler";

export async function createTermFragment(
  title: string,
  content: string,
  tags: string[],
  parameters: string[]
): Promise<ApiResult<string>> {
  try {
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
    return createSuccessResult(docRef.id);
  } catch (error) {
    const appError = handleError(error);
    logError(appError, "createTermFragment");
    return createErrorResult(appError);
  }
}

export async function updateTermFragment(
  fragmentId: string,
  title: string,
  content: string,
  tags: string[],
  parameters: string[]
): Promise<ApiResult<void>> {
  try {
    const fragmentRef = doc(db, "termFragments", fragmentId);
    const fragmentDoc = await getDoc(fragmentRef);

    if (!fragmentDoc.exists()) {
      throw new Error("規約片が見つかりません");
    }

    const currentData = fragmentDoc.data() as TermFragment;

    await addDoc(collection(db, "termFragments", fragmentId, "versions"), {
      title: currentData.title,
      content: currentData.content,
      templateParams: currentData.templateParams,
      tags: currentData.tags,
      createdAt: currentData.createdAt,
      updatedAt: currentData.updatedAt,
    });

    await updateDoc(fragmentRef, {
      title,
      content,
      parameters,
      tags,
      currentVersion: currentData.currentVersion + 1,
      updatedAt: serverTimestamp(),
    });

    return createSuccessResult(undefined);
  } catch (error) {
    const appError = handleError(error);
    logError(appError, "updateTermFragment");
    return createErrorResult(appError);
  }
}

export async function deleteTermFragment(fragmentId: string): Promise<ApiResult<void>> {
  try {
    const fragmentRef = doc(db, "termFragments", fragmentId);
    await deleteDoc(fragmentRef);
    return createSuccessResult(undefined);
  } catch (error) {
    const appError = handleError(error);
    logError(appError, "deleteTermFragment");
    return createErrorResult(appError);
  }
}

export async function getTermFragment(fragmentId: string): Promise<ApiResult<TermFragment | null>> {
  try {
    const fragmentRef = doc(db, "termFragments", fragmentId);
    const fragmentDoc = await getDoc(fragmentRef);

    if (!fragmentDoc.exists()) {
      return createSuccessResult(null);
    }

    return createSuccessResult(fragmentDoc.data() as TermFragment);
  } catch (error) {
    const appError = handleError(error);
    logError(appError, "getTermFragment");
    return createErrorResult(appError);
  }
}
