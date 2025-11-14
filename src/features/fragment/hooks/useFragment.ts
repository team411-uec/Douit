import { useCallback, useEffect, useState } from 'react';
import { useFirebaseServices } from '@/hooks/useFirebaseServices';
import type { AsyncState } from '@/lib/AsyncState';
import type { TermFragment } from '@/types';
import { getTermFragment } from '../services/fragmentService';

export default function useFragment(
  id: string,
): AsyncState<TermFragment> & { refetch: () => void } {
  const { db } = useFirebaseServices();
  const [state, setState] = useState<AsyncState<TermFragment>>({
    data: null,
    loading: true,
    error: null,
  });

  const refetch = useCallback(async () => {
    try {
      setState((s) => ({ ...s, loading: true, error: null }));
      const data = await getTermFragment(db, id);
      if (data) {
        setState((s) => ({ ...s, data, loading: false }));
      } else {
        setState((s) => ({ ...s, error: '規約片が見つかりませんでした', loading: false }));
      }
    } catch (error) {
      console.error('Failed to fetch fragment:', error);
      setState((s) => ({ ...s, error: '規約片の取得に失敗しました', loading: false }));
    }
  }, [db, id]);

  useEffect(() => {
    if (id) {
      refetch();
    }
  }, [id, refetch]);

  return { ...state, refetch };
}
