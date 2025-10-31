"use client";

import { Box } from "@radix-ui/themes";
import Header from "@/components/Organisims/Header";
import { use } from "react";
import { useAuth } from "@/contexts/AuthContext";
import useFragment from "@/hooks/useFragment";
import PageStatus from "@/components/Molecules/PageStatus";
import EditFragment from "@/components/Organisims/EditFragment";

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
