import { useState, useEffect } from "react";
import { getUserTermSetWithFragments } from "@/functions/termSetService";
import { getTermFragment } from "@/functions/termFragments";
import { isFragmentUnderstood } from "@/functions/understandingService";
import { TermFragment, FragmentRef, TermSet } from "@/types";

interface FragmentWithData {
  ref: FragmentRef;
  data: TermFragment;
  understood: boolean;
}

interface UseTermSetAcceptanceReturn {
  termSetData: TermSet | null;
  fragments: FragmentWithData[];
  loading: boolean;
  error: string | null;
  commonParameters: Record<string, string>;
}

export function useTermSetAcceptance(
  termSetId: string,
  userId: string | null
): UseTermSetAcceptanceReturn {
  const [termSetData, setTermSetData] = useState<TermSet | null>(null);
  const [fragments, setFragments] = useState<FragmentWithData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 共通パラメータを抽出する関数
  const getCommonParameters = (fragmentList: FragmentWithData[]): Record<string, string> => {
    const allParams: Record<string, string> = {};

    fragmentList.forEach(fragment => {
      Object.entries(fragment.ref.parameterValues).forEach(([key, value]) => {
        if (allParams[key] && allParams[key] !== value) {
          // 値が異なる場合は共通パラメータから除外
          delete allParams[key];
        } else {
          allParams[key] = value;
        }
      });
    });

    return allParams;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // 規約セットとフラグメント参照を取得
        const termSetResult = await getUserTermSetWithFragments(termSetId);
        if (!termSetResult) {
          setError("規約セットが見つかりませんでした");
          return;
        }

        setTermSetData(termSetResult.set);

        // 各フラグメントの詳細データと理解状態を取得
        const fragmentsWithData: FragmentWithData[] = [];

        for (const fragmentRef of termSetResult.fragments) {
          try {
            const fragmentResult = await getTermFragment(fragmentRef.fragmentId);
            if (fragmentResult.success && fragmentResult.data) {
              const fragmentData = fragmentResult.data;
              let understood = false;

              if (userId) {
                const understoodResult = await isFragmentUnderstood(userId, fragmentRef.fragmentId);
                understood = understoodResult.success ? understoodResult.data || false : false;
              }

              fragmentsWithData.push({
                ref: fragmentRef,
                data: fragmentData,
                understood,
              });
            }
          } catch (error) {
            console.error(`フラグメント ${fragmentRef.fragmentId} の取得に失敗:`, error);
          }
        }

        setFragments(fragmentsWithData);
      } catch (err) {
        console.error("データの取得に失敗しました:", err);
        setError("データの取得に失敗しました");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [termSetId, userId]);

  return {
    termSetData,
    fragments,
    loading,
    error,
    commonParameters: getCommonParameters(fragments),
  };
}
