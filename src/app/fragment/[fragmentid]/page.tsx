"use client";

import { Box } from "@radix-ui/themes";
import Header from "@/components/Organisims/Header";
import { use } from "react";
import { useAuth } from "@/contexts/AuthContext";
import useFragment from "@/hooks/useFragment";
import PageStatus from "@/components/Molecules/PageStatus";
import FragmentDetail from "@/components/Organisims/FragmentDetail";

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
