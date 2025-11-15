'use client';

import { Box, Flex, Text } from '@radix-ui/themes';
import type { TermSet } from '../types';
import TermsCard from './TermsCard';

interface TermSetListProps {
  termSets: TermSet[];
}

export default function TermSetList({ termSets }: TermSetListProps) {
  if (termSets.length === 0) {
    return (
      <Box className="text-center py-8">
        <Text size="4" color="gray">
          まだ利用規約を作成していません
        </Text>
      </Box>
    );
  }

  return (
    <Flex direction="column" gap="3" className="mb-6">
      {termSets.map((term) => (
        <TermsCard key={term.id} term={term} />
      ))}
    </Flex>
  );
}
