'use client';

import { Box, Flex, Heading } from '@radix-ui/themes';
import type { UnderstoodRecord } from '@/types';
import UnderstoodTermCard from './UnderstoodTermCard';

interface UnderstoodRecordListProps {
  records: UnderstoodRecord[];
}

export default function UnderstoodRecordList({ records }: UnderstoodRecordListProps) {
  if (records.length === 0) {
    return (
      <Box className="text-center py-8">
        <Heading size="4" color="gray">
          理解済みの規約片がありません
        </Heading>
      </Box>
    );
  }

  return (
    <Flex direction="column" gap="4">
      {records.map((record) => (
        <UnderstoodTermCard key={record.fragmentId} record={record} />
      ))}
    </Flex>
  );
}
