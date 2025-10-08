"use client";

import { Heading, Text, Box } from "@radix-ui/themes";
import PageLayout from "@/components/Layout/PageLayout";
import LoadingSpinner from "@/components/LoadingSpinner";
import EmptyState from "@/components/EmptyState";
import ParameterDisplay from "@/components/UI/ParameterDisplay";
import FragmentCheckCard from "@/components/UI/FragmentCheckCard";
import { use } from "react";
import { useUser } from "@/contexts/AuthContext";
import { useTermSetAcceptance } from "@/hooks/useTermSetAcceptance";

export default function AcceptCheckPage({ params }: { params: Promise<{ termSetId: string }> }) {
  const resolvedParams = use(params);
  const user = useUser();

  const { termSetData, fragments, loading, error, commonParameters } = useTermSetAcceptance(
    resolvedParams.termSetId,
    user?.uid || null
  );

  if (loading) {
    return (
      <PageLayout showUserIcon={true}>
        <LoadingSpinner />
      </PageLayout>
    );
  }

  if (error || !termSetData) {
    return (
      <PageLayout showUserIcon={true}>
        <EmptyState title={error || "規約セットが見つかりませんでした"} />
      </PageLayout>
    );
  }

  return (
    <PageLayout showUserIcon={true}>
      {/* Page Title */}
      <Heading size="6" color="gray" className="mb-6">
        利用規約同意可能性確認画面
      </Heading>

      {/* Term Set Title */}
      <Heading size="5" className="mb-2">
        {termSetData.title}
      </Heading>
      <Text size="2" color="gray" className="mb-6">
        {termSetData.description || "team411"}
      </Text>

      {/* Common Parameters */}
      <ParameterDisplay title="共通パラメータ" parameters={commonParameters} />

      {/* Fragments List */}
      <Box>
        {fragments.map(fragment => (
          <FragmentCheckCard
            key={fragment.ref.fragmentId}
            fragment={fragment}
            commonParams={commonParameters}
          />
        ))}
      </Box>

      {/* Summary */}
      {fragments.length > 0 && (
        <Box className="mt-8 text-center">
          <Text size="3" color="gray">
            理解済み: {fragments.filter(f => f.understood).length} / {fragments.length}
          </Text>
        </Box>
      )}
    </PageLayout>
  );
}
