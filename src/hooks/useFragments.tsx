import { searchTermFragments } from "@/functions/tagSearch";
import { TermFragment } from "@/types";
import { useEffect, useState } from "react";

export function useFragments(searchTag: string): [TermFragment[], boolean] {
  const [fragments, setFragments] = useState<TermFragment[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchFragments = async () => {
      try {
        setLoading(true);
        const results = await searchTermFragments(searchTag);
        setFragments(results);
      } catch (error) {
        console.error("規約片の取得に失敗しました:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFragments();
  }, [searchTag]);
  return [fragments, loading];
}
