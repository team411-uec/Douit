'use client';

import { Box, Flex, Heading, Button, Text, Card, Separator } from '@radix-ui/themes';
import { CheckIcon, QuestionMarkIcon } from '@radix-ui/react-icons';
import Link from 'next/link';
import type { User } from 'firebase/auth';
import useFragment from '@/features/fragment/hooks/useFragment';
import type { FragmentRef } from '@/types';

interface TermSetFragmentCardProps {
  fragment: FragmentRef;
  user: User;
  isUnderstood: boolean;
}

export default function TermSetFragmentCard({
  fragment,
  user,
  isUnderstood,
}: TermSetFragmentCardProps) {
  const { data: fragmentDetails, loading, error } = useFragment(fragment.fragmentId);

  if (loading) {
    return (
      <Card size="2">
        <Text size="3" color="gray">
          読み込み中...
        </Text>
      </Card>
    );
  }

  if (error || !fragmentDetails) {
    return (
      <Card size="2">
        <Text size="3" color="red">
          {error || 'フラグメント詳細の取得に失敗しました'}
        </Text>
      </Card>
    );
  }

  return (
    <Card size="2">
      <Flex align="center" justify="between" className="mb-3">
        <Flex align="center" gap="2">
          <Box className={isUnderstood ? 'text-green-600' : 'text-gray-500'}>
            {isUnderstood ? (
              <CheckIcon width="16" height="16" />
            ) : (
              <QuestionMarkIcon width="16" height="16" />
            )}
          </Box>
          <Heading size="4" className={isUnderstood ? 'text-green-600' : 'text-gray-500'}>
            {fragmentDetails.title}
          </Heading>
        </Flex>
        <Link href={`/fragment/${fragment.fragmentId}`}>
          <Button size="2" className="text-white">
            読む
          </Button>
        </Link>
      </Flex>
      {fragment.parameterValues &&
        Object.entries(fragment.parameterValues).map(([key, value], index) => (
          <Box key={key}>
            {index > 0 && <Separator my="1" />}
            <Flex justify="between">
              <Text size="2" color="gray">
                {key}
              </Text>
              <Text size="2" color="gray">
                {String(value)}
              </Text>
            </Flex>
          </Box>
        ))}
      <Box>
        <Separator my="1" />
        <Flex justify="between">
          <Text size="2" color="gray">
            CONTACT
          </Text>
          <Text size="2" color="gray">
            {user.email}
          </Text>
        </Flex>
      </Box>
    </Card>
  );
}
