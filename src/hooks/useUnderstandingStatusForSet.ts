import { useEffect, useState } from "react";
import { getUnderstandingStatusForSet } from "@/repositories/understandingService";
import { useAuth } from "@/contexts/AuthContext";
import { AsyncState } from "@/lib/AsyncState";

type UnderstandingStatus = {
  fragmentId: string;
  isUnderstood: boolean;
  understoodAt?: Date;
  version?: number;
};

export function useUnderstandingStatusForSet(termSetId: string): AsyncState<UnderstandingStatus[]> {
  const { user } = useAuth();
  const [state, setState] = useState<AsyncState<UnderstandingStatus[]>>({
    data: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const fetchStatus = async () => {
      if (user && termSetId) {
        try {
          setState(s => ({ ...s, loading: true, error: null }));
          const statusData = await getUnderstandingStatusForSet(user.uid, termSetId);
          setState(s => ({ ...s, data: statusData, loading: false }));
        } catch (error) {
          console.error("理解状況の取得に失敗しました:", error);
          setState(s => ({ ...s, error: "理解状況の取得に失敗しました", loading: false }));
        }
      }
    };

    fetchStatus();
  }, [user, termSetId]);

  return state;
}
