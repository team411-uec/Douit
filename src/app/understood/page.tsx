"use client";

import { Box, Heading, Container } from "@radix-ui/themes";
import Header from "@/components/Organisims/Header";
import { useAuth } from "@/contexts/AuthContext";
import { useUnderstoodRecords } from "@/hooks/useUnderstoodRecords";
import PageStatus from "@/components/Molecules/PageStatus";
import UnderstoodRecordList from "@/components/Organisims/UnderstoodRecordList";

export default function UnderstoodPage() {
  const { user } = useAuth();
  const { data: understoodRecords, loading, error } = useUnderstoodRecords();

  return (
    <Box className="min-h-screen">
      <Header showUserIcon={true} />
      <PageStatus user={user} loading={loading} error={error}>
        <Container size="1" className="px-6 py-6">
          <Heading size="6" className="mb-6">
            理解済み規約片
          </Heading>

          {understoodRecords && <UnderstoodRecordList records={understoodRecords} />}
        </Container>
      </PageStatus>
    </Box>
  );
}
