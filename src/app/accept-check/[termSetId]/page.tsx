"use client";

import { Box } from "@radix-ui/themes";
import Header from "@/components/Organisims/Header";
import { use } from "react";
import { useAuth } from "@/contexts/AuthContext";
import useTermSet from "@/hooks/useTermSet";
import { useFragmentsWithStatus } from "@/hooks/useFragmentsWithStatus";
import PageStatus from "@/components/Molecules/PageStatus";
import AcceptCheck from "@/components/Organisims/AcceptCheck";

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
