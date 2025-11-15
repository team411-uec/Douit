import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '@/features/auth/contexts/AuthContext';
import { useFirebaseServices } from '@/hooks/useFirebaseServices';
import type { AsyncState } from '@/lib/AsyncState';
import type { TermSet } from '@/features/termSet/types';
import { getTermSetsOf } from '../services/termSetService';

export function useUserTermSets(): AsyncState<TermSet[]> & { refetch: () => void } {
  const { user } = useAuth();
  const { db } = useFirebaseServices();
  const [state, setState] = useState<AsyncState<TermSet[]>>({
    data: null,
    loading: true,
    error: null,
  });

  const fetchUserTermSets = useCallback(async () => {
    if (user) {
      try {
        setState((s) => ({ ...s, loading: true, error: null }));
        const termSets = await getTermSetsOf(db, user.uid);
        setState((s) => ({ ...s, data: termSets, loading: false }));
      } catch (error) {
        console.error('規約セット一覧の取得に失敗しました:', error);
        setState((s) => ({ ...s, error: '規約セット一覧の取得に失敗しました', loading: false }));
      }
    }
  }, [db, user]);

  useEffect(() => {
    fetchUserTermSets();
  }, [fetchUserTermSets]);

  return { ...state, refetch: fetchUserTermSets };
}
