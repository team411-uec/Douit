'use client';

import { Box } from '@radix-ui/themes';
import Header from '@/components/ui/Header';
import { useAuth } from '@/features/auth/contexts/AuthContext';
import UserProfile from '@/features/user/components/UserProfile';
import PageStatus from '@/components/ui/PageStatus';

export default function UserPage() {
  const { user } = useAuth();

  return (
    <Box className="min-h-screen">
      <Header />
      <PageStatus user={user} loading={false} error={null}>
        <UserProfile showEmail={true} showLinks={true} />
      </PageStatus>
    </Box>
  );
}
