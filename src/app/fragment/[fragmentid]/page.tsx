'use client';

import { Box } from '@radix-ui/themes';
import Header from '@/components/ui/Header';
import { use } from 'react';
import { useAuth } from '@/features/auth/contexts/AuthContext';
import useFragment from '@/features/fragment/hooks/useFragment';
import PageStatus from '@/components/ui/PageStatus';
import FragmentDetail from '@/features/fragment/components/FragmentDetail';

export default function FragmentDetailPage({
  params,
}: {
  params: Promise<{ fragmentid: string }>;
}) {
  const resolvedParams = use(params);
  const { data: fragmentData, loading, error } = useFragment(resolvedParams.fragmentid);
  const { user } = useAuth();

  return (
    <Box className="min-h-screen">
      <Header showUserIcon={true} />
      <PageStatus user={user} loading={loading} error={error}>
        {fragmentData && (
          <FragmentDetail fragmentId={resolvedParams.fragmentid} fragmentData={fragmentData} />
        )}
      </PageStatus>
    </Box>
  );
}
