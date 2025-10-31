"use client";

import { Box } from "@radix-ui/themes";
import Header from "@/components/ui/Header";
import { useAuth } from "@/features/auth/contexts/AuthContext";
import { use } from "react";
import useTermSet from "@/features/termSet/hooks/useTermSet";
import { useTermSetFragments } from "@/features/termSet/hooks/useTermSetFragments";
import { useUnderstandingStatusForSet } from "@/features/understanding/hooks/useUnderstandingStatusForSet";
import PageStatus from "@/components/ui/PageStatus";
import TermSetDetail from "@/features/termSet/components/TermSetDetail";

export default function TermDetailPage({ params }: { params: Promise<{ termid: string }> }) {
  const { user } = useAuth();
  const resolvedParams = use(params);
  const {
    data: termSetData,
    loading: termSetLoading,
    error: termSetError,
  } = useTermSet(resolvedParams.termid);
  const {
    data: fragments,
    loading: fragmentsLoading,
    error: fragmentsError,
  } = useTermSetFragments(resolvedParams.termid);
  const {
    data: understandingStatus,
    loading: understandingLoading,
    error: understandingError,
  } = useUnderstandingStatusForSet(resolvedParams.termid);

  const loading = termSetLoading || fragmentsLoading || understandingLoading;
  const error = termSetError || fragmentsError || understandingError;

  return (
    <Box className="min-h-screen">
      <Header />
      <PageStatus user={user} loading={loading} error={error}>
        {termSetData && fragments && understandingStatus && user && (
          <TermSetDetail
            user={user}
            termSet={termSetData}
            fragments={fragments}
            understandingStatus={understandingStatus}
            termSetId={resolvedParams.termid}
          />
        )}
      </PageStatus>
    </Box>
  );
}
