'use client';

import { PlusIcon } from '@radix-ui/react-icons';
import { Box, Button, Container, Dialog, Heading } from '@radix-ui/themes';
import { useState } from 'react';
import Header from '@/components/ui/Header';
import PageStatus from '@/components/ui/PageStatus';
import { useAuth } from '@/features/auth/contexts/AuthContext';
import NewTermSetDialog from '@/features/termSet/components/NewTermSetDialog';
import TermSetList from '@/features/termSet/components/TermSetList';
import { useUserTermSets } from '@/features/termSet/hooks/useUserTermSets';

export default function TermsPage() {
  const { user } = useAuth();
  const { data: termsData, loading, error, refetch } = useUserTermSets();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <Box className="min-h-screen">
      <Header />
      <PageStatus user={user} loading={loading} error={error}>
        <Container size="1" className="px-6 py-6">
          <Heading size="6" className="mb-6">
            作成した利用規約
          </Heading>

          {termsData && <TermSetList termSets={termsData} />}

          <Dialog.Root open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <Dialog.Trigger>
              <Box className="fixed bottom-6 right-6">
                <Button size="4" className="w-14 h-14 rounded-full text-white shadow-lg">
                  <PlusIcon width="24" height="24" />
                </Button>
              </Box>
            </Dialog.Trigger>
            <NewTermSetDialog
              open={isDialogOpen}
              onOpenChange={setIsDialogOpen}
              onTermSetCreated={refetch}
            />
          </Dialog.Root>
        </Container>
      </PageStatus>
    </Box>
  );
}
