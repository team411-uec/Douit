import { Box, Flex, Heading, Card } from '@radix-ui/themes';
import Link from 'next/link';
import type { UnderstoodRecord } from '@/types';
import useFragment from '@/features/fragment/hooks/useFragment';

interface UnderstoodTermCardProps {
  record: UnderstoodRecord;
}

export default function UnderstoodTermCard({ record }: UnderstoodTermCardProps) {
  const { data: fragment, loading, error } = useFragment(record.fragmentId);

  if (loading || !fragment) return null;
  if (error) return null; // or show error state

  return (
    <Link href={`/fragment/${record.fragmentId}`} className="no-underline">
      <Card size="2" className="hover:shadow-md transition-shadow cursor-pointer">
        <Flex align="center" justify="between">
          <Heading size="4" color="gray" className="flex-1">
            {fragment.title || '規約片'}
          </Heading>
          <Flex align="center" gap="2">
            <Box className="text-sm text-gray-500">{record.version}</Box>
            <Box className="text-sm text-gray-500">
              {record.understoodAt ? new Date(record.understoodAt).toLocaleDateString() : ''}
            </Box>
          </Flex>
        </Flex>
      </Card>
    </Link>
  );
}
