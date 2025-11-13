import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import { useEffect, useState } from 'react';

import { db } from '@/lib/firebase';
import type { FragmentRef } from '../types';
import type { AsyncState } from '@/lib/AsyncState';

export function useTermSetFragments(termSetId: string): AsyncState<FragmentRef[]> {
  const [state, setState] = useState<AsyncState<FragmentRef[]>>({
    data: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const fetchFragments = async () => {
      if (termSetId) {
        try {
          setState((s) => ({ ...s, loading: true, error: null }));
          const fragmentsQuery = query(
            collection(db, 'term_sets', termSetId, 'fragments'),
            orderBy('order'),
          );
          const fragmentsSnapshot = await getDocs(fragmentsQuery);
          const fragments = fragmentsSnapshot.docs.map((doc) => ({ ...doc.data() }) as FragmentRef);
          setState((s) => ({ ...s, data: fragments, loading: false }));
        } catch (error) {
          console.error('フラグメント参照の取得に失敗しました:', error);
          setState((s) => ({
            ...s,
            error: 'フラグメント参照の取得に失敗しました',
            loading: false,
          }));
        }
      }
    };

    fetchFragments();
  }, [termSetId]);

  return state;
}
