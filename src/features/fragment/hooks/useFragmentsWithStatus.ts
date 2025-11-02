import { useEffect, useState } from "react";
import { TermFragment, FragmentRef } from "@/types";
import { getTermFragment } from "../services/fragmentService";
import { isFragmentUnderstood } from "@/features/understanding/services/understandingService";
import { useAuth } from "@/features/auth/contexts/AuthContext";
import { AsyncState } from "@/lib/AsyncState";

export interface FragmentWithData {
  ref: FragmentRef;
  data: TermFragment;
  understood: boolean;
}

export function useFragmentsWithStatus(
  fragmentRefs: FragmentRef[] | undefined
): AsyncState<FragmentWithData[]> {
  const { user } = useAuth();
  const [state, setState] = useState<AsyncState<FragmentWithData[]>>({
    data: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const fetchFragments = async () => {
      if (user && fragmentRefs) {
        try {
          setState(s => ({ ...s, loading: true, error: null }));
          const fragmentsWithData = await Promise.all(
            fragmentRefs.map(async ref => {
              const promiseAllResult = await Promise.all([
                getTermFragment(ref.fragmentId), //eslint-disable-line
                isFragmentUnderstood(user.uid, ref.fragmentId), //eslint-disable-line
              ]);
              const [fragmentData, understood] = promiseAllResult;
              if (!fragmentData) {
                throw new Error(`Fragment with id ${ref.fragmentId} not found`);
              }
              return { ref, data: fragmentData, understood };
            })
          );
          setState(s => ({ ...s, data: fragmentsWithData, loading: false }));
        } catch (error) {
          console.error("フラグメントデータの取得に失敗しました:", error);
          setState(s => ({
            ...s,
            error: "フラグメントデータの取得に失敗しました",
            loading: false,
          }));
        }
      }
    };

    fetchFragments();
  }, [user, fragmentRefs]);

  return state;
}
