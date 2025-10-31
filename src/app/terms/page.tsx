"use client";

import { Box, Heading, Button, Container, Dialog } from "@radix-ui/themes";
import { PlusIcon } from "@radix-ui/react-icons";
import Header from "@/components/Organisims/Header";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import { useUserTermSets } from "@/hooks/useUserTermSets";
import PageStatus from "@/components/Molecules/PageStatus";
import TermSetList from "@/components/Organisims/TermSetList";
import NewTermSetDialog from "@/components/Organisims/NewTermSetDialog";

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
