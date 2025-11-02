"use client";

import { Box } from "@radix-ui/themes";
import Header from "@/components/ui/Header";
import { use } from "react";
import { useAuth } from "@/features/auth/contexts/AuthContext";
import useTermSet from "@/features/termSet/hooks/useTermSet";
import { useFragmentsWithStatus } from "@/features/fragment/hooks/useFragmentsWithStatus";
import PageStatus from "@/components/ui/PageStatus";
import AcceptCheck from "@/features/understanding/components/AcceptCheck";

export default function AcceptCheckPage({ params }: { params: Promise<{ termSetId: string }> }) {
  const resolvedParams = use(params);
  const { user } = useAuth();
  const {
    data: termSetData,
    loading: termSetLoading,
    error: termSetError,
  } = useTermSet(resolvedParams.termSetId);
  const {
    data: fragments,
    loading: fragmentsLoading,
    error: fragmentsError,
  } = useFragmentsWithStatus(termSetData?.fragmentsRefs);

  const loading = termSetLoading || fragmentsLoading;
  const error = termSetError || fragmentsError;

  return (
    <Box className="min-h-screen">
      <Header showUserIcon={true} />
      <PageStatus user={user} loading={loading} error={error}>
        {termSetData && fragments && (
          <AcceptCheck termSetData={termSetData} fragments={fragments} />
        )}
      </PageStatus>
    </Box>
  );
}
