import { useEffect, useState } from 'react';
import { useFirebaseServices } from '@/hooks/useFirebaseServices';
import type { AsyncState } from '@/lib/AsyncState';
import type { TermSet } from '@/types';
import { getTermSet } from '../services/termSetService';

export default function useTermSet(termSetId: string): AsyncState<TermSet> {
  const [termSetData, setTermSetData] = useState<TermSet | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { db } = useFirebaseServices();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const termSetResult = await getTermSet(db, termSetId);
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
  }, [db, termSetId]);

  return {
    data: termSetData,
    loading,
    error,
  };
}
