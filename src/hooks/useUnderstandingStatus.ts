import { useEffect, useState } from "react";
import { isFragmentUnderstood } from "@/repositories/understandingService";
import { useAuth } from "@/contexts/AuthContext";

export function useUnderstandingStatus(fragmentId: string) {
  const { user } = useAuth();
  const [understanding, setUnderstanding] = useState<"understood" | "unknown">("unknown");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkStatus = async () => {
      if (user && fragmentId) {
        try {
          setLoading(true);
          setError(null);
          const isUnderstood = await isFragmentUnderstood(user.uid, fragmentId);
          setUnderstanding(isUnderstood ? "understood" : "unknown");
        } catch (error) {
          console.error("理解状態の取得に失敗しました:", error);
          setError("理解状態の取得に失敗しました");
        } finally {
          setLoading(false);
        }
      }
    };

    checkStatus();
  }, [user, fragmentId]);

  return { understanding, setUnderstanding, loading, error };
}
