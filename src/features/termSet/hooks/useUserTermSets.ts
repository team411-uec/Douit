import { useEffect, useState, useCallback } from "react";
import { getTermSetsOf } from "../services/termSetService";
import { useAuth } from "@/features/auth/contexts/AuthContext";
import { TermSet } from "@/types";
import { AsyncState } from "@/lib/AsyncState";

export function useUserTermSets(): AsyncState<TermSet[]> & { refetch: () => void } {
  const { user } = useAuth();
  const [state, setState] = useState<AsyncState<TermSet[]>>({
    data: null,
    loading: true,
    error: null,
  });

  const fetchUserTermSets = useCallback(async () => {
    if (user) {
      try {
        setState(s => ({ ...s, loading: true, error: null }));
        const termSets = await getTermSetsOf(user.uid);
        setState(s => ({ ...s, data: termSets, loading: false }));
      } catch (error) {
        console.error("規約セット一覧の取得に失敗しました:", error);
        setState(s => ({ ...s, error: "規約セット一覧の取得に失敗しました", loading: false }));
      }
    }
  }, [user]);

  useEffect(() => {
    fetchUserTermSets();
  }, [fetchUserTermSets]);

  return { ...state, refetch: fetchUserTermSets };
}
