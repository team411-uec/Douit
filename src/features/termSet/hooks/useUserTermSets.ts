import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '@/features/auth/contexts/AuthContext';
import type { AsyncState } from '@/lib/AsyncState';
import { getTermSetsOf } from '../services/termSetService';
import type { TermSet } from '../types';

export function useUserTermSets(): AsyncState<TermSet[]> & { refetch: () => void } {
  const { user } = useAuth();
  const [state, setState] = useState<AsyncState<TermSet[]>>({
    data: null,
    loading: true,
    error: null,
  });

  const fetchUserTermSets = useCallback(async () => {
    if (user) {
      try {
        setState((s) => ({ ...s, loading: true, error: null }));
        const termSets = await getTermSetsOf(user.uid);
        setState((s) => ({ ...s, data: termSets, loading: false }));
      } catch (error) {
        console.error('規約セット一覧の取得に失敗しました:', error);
        setState((s) => ({ ...s, error: '規約セット一覧の取得に失敗しました', loading: false }));
      }
    }
  }, [user]);

  useEffect(() => {
    fetchUserTermSets();
  }, [fetchUserTermSets]);

  return { ...state, refetch: fetchUserTermSets };
}
