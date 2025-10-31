"use client";

import { Box, Heading, Text, Container } from "@radix-ui/themes";
import CommonParametersCard from "@/components/ui/CommonParametersCard";
import FragmentStatusCard from "@/features/fragment/components/FragmentStatusCard";
import UnderstandingSummary from "./UnderstandingSummary";
import { TermSet } from "@/types";
import { FragmentWithData } from "@/features/fragment/hooks/useFragmentsWithStatus";

type AcceptCheckProps = {
  termSetData: TermSet;
  fragments: FragmentWithData[];
};

export default function AcceptCheck({ termSetData, fragments }: AcceptCheckProps) {
  const getCommonParameters = () => {
    if (!fragments) return {};
    const allParams: Record<string, string> = {};
    fragments.forEach(fragment => {
      Object.entries(fragment.ref.parameterValues).forEach(([key, value]) => {
        if (allParams[key] && allParams[key] !== value) {
          delete allParams[key];
        } else {
          allParams[key] = value;
        }
      });
    });
    return allParams;
  };

  const commonParams = getCommonParameters();

  return (
    <Container size="1" px="4" py="6">
      <Heading size="6" color="gray" className="mb-6">
        利用規約同意可能性確認画面
      </Heading>

      <Heading size="5" className="mb-2">
        {termSetData.title}
      </Heading>
      <Text size="2" color="gray" className="mb-6">
        {termSetData.description}
      </Text>

      <CommonParametersCard commonParams={commonParams} />

      <Box>
        {fragments.map(fragment => (
          <FragmentStatusCard
            key={fragment.ref.fragmentId}
            fragment={fragment}
            commonParams={commonParams}
          />
        ))}
      </Box>

      <UnderstandingSummary fragments={fragments} />
    </Container>
  );
}
