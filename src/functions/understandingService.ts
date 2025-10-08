import { db } from "./firebase";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { UnderstoodRecord, TermFragment, ApiResult } from "@/types";
import {
  handleError,
  createErrorResult,
  createSuccessResult,
  logError,
} from "@/utils/errorHandler";

export async function addUnderstoodRecord(
  userId: string,
  fragmentId: string,
  version: number
): Promise<ApiResult<string>> {
  try {
    // 既に同じフラグメントIDとバージョンの記録が存在するかチェック
    const existingQuery = query(
      collection(db, "users", userId, "understood"),
      where("fragmentId", "==", fragmentId),
      where("version", "==", version)
    );

    const existingSnapshot = await getDocs(existingQuery);

    if (!existingSnapshot.empty) {
      throw new Error("この規約片のバージョンは既に理解済みとして記録されています");
    }

    const recordData: Omit<UnderstoodRecord, "id"> = {
      userId,
      fragmentId,
      acceptanceLevel: version,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const docRef = await addDoc(collection(db, "users", userId, "understood"), {
      ...recordData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    return createSuccessResult(docRef.id);
  } catch (error) {
    const appError = handleError(error);
    logError(appError, "addUnderstoodRecord");
    return createErrorResult(appError);
  }
}

/**
 * 理解記録の削除
 */
export async function removeUnderstoodRecord(
  userId: string,
  fragmentId: string
): Promise<ApiResult<void>> {
  try {
    const q = query(
      collection(db, "users", userId, "understood"),
      where("fragmentId", "==", fragmentId)
    );

    const querySnapshot = await getDocs(q);

    // 該当する記録をすべて削除
    const deletePromises = querySnapshot.docs.map(doc => deleteDoc(doc.ref));
    await Promise.all(deletePromises);

    return createSuccessResult(undefined);
  } catch (error) {
    const appError = handleError(error);
    logError(appError, "removeUnderstoodRecord");
    return createErrorResult(appError);
  }
}

/**
 * ユーザーの理解記録を取得
 */
export async function getUserUnderstoodRecords(
  userId: string
): Promise<ApiResult<(UnderstoodRecord & { id: string })[]>> {
  try {
    const querySnapshot = await getDocs(
      query(collection(db, "users", userId, "understood"), orderBy("understoodAt", "desc"))
    );

    const records = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as (UnderstoodRecord & { id: string })[];

    return createSuccessResult(records);
  } catch (error) {
    const appError = handleError(error);
    logError(appError, "getUserUnderstoodRecords");
    return createErrorResult(appError);
  }
}

/**
 * 特定のフラグメントを理解しているかチェック
 */
export async function isFragmentUnderstood(
  userId: string,
  fragmentId: string,
  version?: number
): Promise<ApiResult<boolean>> {
  try {
    let q = query(
      collection(db, "users", userId, "understood"),
      where("fragmentId", "==", fragmentId)
    );

    if (version !== undefined) {
      q = query(q, where("version", "==", version));
    }

    const querySnapshot = await getDocs(q);
    return createSuccessResult(!querySnapshot.empty);
  } catch (error) {
    const appError = handleError(error);
    logError(appError, "isFragmentUnderstood");
    return createErrorResult(appError);
  }
}

/**
 * 理解記録一覧（フラグメント情報付き）を取得
 */
export async function getUnderstoodRecordsWithFragments(userId: string): Promise<
  ApiResult<
    {
      record: UnderstoodRecord & { id: string };
      fragment: TermFragment | null;
    }[]
  >
> {
  try {
    const recordsResult = await getUserUnderstoodRecords(userId);
    if (!recordsResult.success || !recordsResult.data) {
      return createErrorResult("理解記録の取得に失敗しました");
    }

    const { getTermFragment } = await import("./termFragments");
    const recordsWithFragments = [];

    for (const record of recordsResult.data) {
      const fragmentResult = await getTermFragment(record.fragmentId);
      recordsWithFragments.push({
        record,
        fragment: fragmentResult.success && fragmentResult.data ? fragmentResult.data : null,
      });
    }

    return createSuccessResult(recordsWithFragments);
  } catch (error) {
    const appError = handleError(error);
    logError(appError, "getUnderstoodRecordsWithFragments");
    return createErrorResult(appError);
  }
}
