import { useState, useEffect } from "react";
import { createUserTermSet, getUserTermSets } from "@/functions/termSetService";
import { type TermsItemData } from "@/components/UI/TermsCard";

interface UseTermsReturn {
  terms: TermsItemData[];
  loading: boolean;
  isCreating: boolean;
  createTerm: (title: string, description?: string) => Promise<boolean>;
  refreshTerms: () => Promise<void>;
}

export function useTerms(userId: string | null): UseTermsReturn {
  const [terms, setTerms] = useState<TermsItemData[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);

  const fetchTerms = async () => {
    if (!userId) {
      setTerms([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const result = await getUserTermSets(userId);
      if (result.success && result.data) {
        setTerms(result.data);
      } else {
        throw new Error(result.error || "利用規約の取得に失敗しました");
      }
    } catch (error) {
      console.error("利用規約の取得に失敗しました:", error);
      // フォールバック用のテストデータ
      setTerms([
        {
          id: "1",
          title: "サークル会則",
          description: "team411",
          createdAt: new Date(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const createTerm = async (title: string, description?: string): Promise<boolean> => {
    if (!userId || !title.trim()) return false;

    try {
      setIsCreating(true);
      await createUserTermSet(userId, title.trim(), description?.trim() || "");
      // 成功時にリストを再取得
      await fetchTerms();
      return true;
    } catch (error) {
      console.error("利用規約の作成に失敗しました:", error);
      return false;
    } finally {
      setIsCreating(false);
    }
  };

  const refreshTerms = async () => {
    await fetchTerms();
  };

  useEffect(() => {
    fetchTerms();
  }, [userId]);

  return {
    terms,
    loading,
    isCreating,
    createTerm,
    refreshTerms,
  };
}
