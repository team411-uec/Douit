'use client';

import { Flex, Heading, Text, Container } from '@radix-ui/themes';
import type { User } from 'firebase/auth';
import CommonParametersCard from '@/components/ui/CommonParametersCard';
import TermSetFragmentCard from './TermSetFragmentCard';
import ShareButton from '@/components/ui/ShareButton';
import type { TermSet, FragmentRef } from '../types';

interface UnderstandingStatus {
  fragmentId: string;
  isUnderstood: boolean;
  understoodAt?: Date;
  version?: number;
}

interface TermSetDetailProps {
  user: User;
  termSet: TermSet;
  fragments: FragmentRef[];
  understandingStatus: UnderstandingStatus[];
  termSetId: string;
}

export default function TermSetDetail({
  user,
  termSet,
  fragments,
  understandingStatus,
  termSetId,
}: TermSetDetailProps) {
  const commonParams = {
    PROVIDER: user.displayName || user.email || '',
    CONTACT: user.email || '',
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
        {fragments.map((fragment) => {
          const fragmentUnderstanding = understandingStatus?.find(
            (status) => status.fragmentId === fragment.fragmentId,
          );
          return (
            <TermSetFragmentCard
              key={fragment.fragmentId}
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
