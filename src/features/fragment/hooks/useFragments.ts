import { useEffect, useState } from 'react';
import type { TermFragment } from '@/features/fragment/types';
import { searchTermFragments } from '@/features/search/services/tagSearch';
import { useFirebaseServices } from '@/hooks/useFirebaseServices';
import type { AsyncState } from '@/lib/AsyncState';

export function useFragments(searchTag?: string): AsyncState<TermFragment[]> {
  const { db } = useFirebaseServices();
  const [state, setState] = useState<AsyncState<TermFragment[]>>({
    data: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const fetchFragments = async () => {
      try {
        setState((s) => ({ ...s, loading: true, error: null }));
        const results = await searchTermFragments(db, searchTag);
        setState((s) => ({ ...s, data: results, loading: false }));
      } catch (error) {
        console.error('規約片の取得に失敗しました:', error);
        setState((s) => ({ ...s, error: '規約片の取得に失敗しました', loading: false }));
      }
    };

    fetchFragments();
  }, [db, searchTag]);

  return state;
}
