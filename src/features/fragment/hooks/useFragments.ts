import { searchTermFragments } from '@/features/search/services/tagSearch';
import type { TermFragment } from '@/types';
import { useEffect, useState } from 'react';
import type { AsyncState } from '@/lib/AsyncState';

export function useFragments(searchTag?: string): AsyncState<TermFragment[]> {
  const [state, setState] = useState<AsyncState<TermFragment[]>>({
    data: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const fetchFragments = async () => {
      try {
        setState((s) => ({ ...s, loading: true, error: null }));
        const results = await searchTermFragments(searchTag);
        setState((s) => ({ ...s, data: results, loading: false }));
      } catch (error) {
        console.error('規約片の取得に失敗しました:', error);
        setState((s) => ({ ...s, error: '規約片の取得に失敗しました', loading: false }));
      }
    };

    fetchFragments();
  }, [searchTag]);

  return state;
}
