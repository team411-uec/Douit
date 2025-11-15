import { useEffect, useState } from 'react';
import type { AsyncState } from '@/lib/AsyncState';
import { getTermSet } from '../services/termSetService';
import type { TermSet } from '../types';

export default function useTermSet(termSetId: string): AsyncState<TermSet> {
  const [termSetData, setTermSetData] = useState<TermSet | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const termSetResult = await getTermSet(termSetId);
        if (!termSetResult) {
          setError('規約が見つかりませんでした');
          return;
        }

        setTermSetData(termSetResult);
      } catch (err) {
        console.error('データの取得に失敗しました:', err);
        setError('データの取得に失敗しました');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [termSetId]);

  return {
    data: termSetData,
    loading,
    error,
  };
}
