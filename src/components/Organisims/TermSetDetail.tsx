"use client";

import { Box, Flex, Heading, Text, Container } from "@radix-ui/themes";
import { User } from "firebase/auth";
import CommonParametersCard from "@/components/Molecules/CommonParametersCard";
import TermSetFragmentCard from "@/components/Organisims/TermSetFragmentCard";
import ShareButton from "@/components/Molecules/ShareButton";
import { TermSet, TermFragment } from "@/domains/types";

type UnderstandingStatus = {
  fragmentId: string;
  isUnderstood: boolean;
  understoodAt?: Date;
  version?: number;
};

type TermSetDetailProps = {
  user: User;
  termSet: TermSet;
  fragments: TermFragment[];
  understandingStatus: UnderstandingStatus[];
  termSetId: string;
};

export default function TermSetDetail({
  user,
  termSet,
  fragments,
  understandingStatus,
  termSetId,
}: TermSetDetailProps) {
  const commonParams = {
    PROVIDER: user.displayName || user.email || "",
    CONTACT: user.email || "",
  };

  return (
    <Container size="1" px="4" py="6">
      <Heading size="6" color="gray" mb="2">
        {termSet.title}
      </Heading>
      <Text size="3" color="gray" mb="6">
        作成者: {user.displayName || user.email}
      </Text>
      <CommonParametersCard commonParams={commonParams} />
      <Flex direction="column" gap="4" mb="6">
        {fragments.map(fragment => {
          const fragmentUnderstanding = understandingStatus?.find(
            status => status.fragmentId === fragment.id
          );
          return (
            <TermSetFragmentCard
              key={fragment.id}
              fragment={fragment}
              user={user}
              isUnderstood={fragmentUnderstanding?.isUnderstood || false}
            />
          );
        })}
      </Flex>
      <ShareButton termSetId={termSetId} />
    </Container>
  );
}
