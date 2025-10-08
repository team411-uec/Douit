import { useState, useEffect, useCallback } from "react";
import { getTermFragment } from "@/functions/termFragments";
import {
  addUnderstoodRecord,
  removeUnderstoodRecord,
  isFragmentUnderstood,
} from "@/functions/understandingService";

import { TermFragment, LoadingState, UseFragmentDetailResult } from "@/types";
import { unwrapApiResult, safeAsync } from "@/utils/helpers";
import { handleError } from "@/utils/errorHandler";

export function useFragmentDetail(
  fragmentId: string,
  userId: string | null
): UseFragmentDetailResult {
  const [fragment, setFragment] = useState<TermFragment | null>(null);
  const [loadingState, setLoadingState] = useState<LoadingState>({ isLoading: true });
  const [isUnderstood, setIsUnderstood] = useState(false);

  const handleUnderstandingChange = useCallback(
    async (understood: boolean) => {
      if (!fragment || !userId) return;

      // 既に同じ状態の場合は何もしない
      if (understood === isUnderstood) return;

      const previousState = isUnderstood;
      setIsUnderstood(understood);

      try {
        if (understood) {
          const result = await addUnderstoodRecord(userId, fragmentId, fragment.currentVersion);
          if (!result.success) {
            throw new Error(result.error);
          }
        } else {
          const result = await removeUnderstoodRecord(userId, fragmentId);
          if (!result.success) {
            throw new Error(result.error);
          }
        }
      } catch (error) {
        // エラーが発生した場合、状態を元に戻す
        setIsUnderstood(previousState);
        console.error("理解記録の更新に失敗しました:", handleError(error).message);
      }
    },
    [fragment, userId, fragmentId, isUnderstood]
  );

  const refreshFragment = useCallback(async () => {
    setLoadingState({ isLoading: true });

    const result = await safeAsync(async () => {
      const fragmentResult = await getTermFragment(fragmentId);
      return unwrapApiResult(fragmentResult, null);
    });

    if (result) {
      setFragment(result);
      setLoadingState({ isLoading: false });
    } else {
      setLoadingState({
        isLoading: false,
        error: "規約片の取得に失敗しました",
      });
    }
  }, [fragmentId]);

  // Fragment データの取得
  useEffect(() => {
    refreshFragment();
  }, [refreshFragment]);

  // 理解状態の初期値を取得
  useEffect(() => {
    const checkUnderstandingStatus = async () => {
      if (userId && fragmentId) {
        const result = await safeAsync(async () => {
          const understandingResult = await isFragmentUnderstood(userId, fragmentId);
          return unwrapApiResult(understandingResult, false);
        });

        if (result !== null) {
          setIsUnderstood(result);
        }
      }
    };

    checkUnderstandingStatus();
  }, [userId, fragmentId]);

  return {
    fragment,
    isLoading: loadingState.isLoading,
    error: loadingState.error || null,
    isUnderstood,
    handleUnderstandingChange,
    refreshData: refreshFragment,
  };
}
