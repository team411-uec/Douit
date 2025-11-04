'use client';

import { Box, Heading, Button, Container } from '@radix-ui/themes';
import Link from 'next/link';
import type { User } from 'firebase/auth';
import type { ApplicationError } from '@/types';

type PageStatusProps = {
  user: User | null | undefined;
  loading: boolean;
  error: ApplicationError | null;
  children: React.ReactNode;
};

export default function PageStatus({ user, loading, error, children }: PageStatusProps) {
  if (loading) {
    return (
      <Container size="1" className="px-6 py-6">
        <Box className="text-center py-8">
          <Heading size="4" color="gray">
            読み込み中...
          </Heading>
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container size="1" className="px-6 py-6">
        <Box className="text-center py-8">
          <Heading size="4" color="red">
            {error.toString()}
          </Heading>
        </Box>
      </Container>
    );
  }

  if (!user) {
    return (
      <Container size="1" className="px-6 py-6">
        <Box className="text-center py-8">
          <Heading size="4" color="gray">
            ログインが必要です
          </Heading>
          <Link href="/login">
            <Button className="mt-4 text-white">ログインページへ</Button>
          </Link>
        </Box>
      </Container>
    );
  }

  return <>{children}</>;
}
