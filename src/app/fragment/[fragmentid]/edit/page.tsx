'use client';

import { Box } from '@radix-ui/themes';
import { use } from 'react';
import Header from '@/components/ui/Header';
import PageStatus from '@/components/ui/PageStatus';
import { useAuth } from '@/features/auth/contexts/AuthContext';
import EditFragment from '@/features/fragment/components/EditFragment';
import useFragment from '@/features/fragment/hooks/useFragment';

export default function EditFragmentPage({ params }: { params: Promise<{ fragmentid: string }> }) {
  const { user } = useAuth();
  const resolvedParams = use(params);
  const { data: fragmentData, loading, error, refetch } = useFragment(resolvedParams.fragmentid);

  return (
    <Box className="min-h-screen">
      <Header showUserIcon={true} />
      <PageStatus user={user} loading={loading} error={error}>
        {fragmentData && (
          <EditFragment
            fragmentId={resolvedParams.fragmentid}
            fragmentData={fragmentData}
            refetch={refetch}
          />
        )}
      </PageStatus>
    </Box>
  );
}
