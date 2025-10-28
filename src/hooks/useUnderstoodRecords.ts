import { useEffect, useState } from "react";
import { getUserUnderstoodRecords } from "@/repositories/understandingService";
import { useAuth } from "@/contexts/AuthContext";
import { UnderstoodRecord } from "@/domains/types";
import { AsyncState } from "@/lib/AsyncState";

export function useUnderstoodRecords(): AsyncState<UnderstoodRecord[]> {
  const { user } = useAuth();
  const [state, setState] = useState<AsyncState<UnderstoodRecord[]>>({
    data: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const fetchRecords = async () => {
      if (user) {
        try {
          setState(s => ({ ...s, loading: true, error: null }));
          const records = await getUserUnderstoodRecords(user.uid);
          setState(s => ({ ...s, data: records, loading: false }));
        } catch (error) {
          console.error("理解記録の取得に失敗しました:", error);
          setState(s => ({ ...s, error: "理解記録の取得に失敗しました", loading: false }));
        }
      }
    };

    fetchRecords();
  }, [user]);

  return state;
}
