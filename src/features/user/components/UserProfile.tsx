'use client';

import { Avatar, Button, Container, Flex, Heading, Text } from '@radix-ui/themes';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/features/auth/contexts/AuthContext';

type UserProfileProps = {
  showEmail?: boolean;
  showLinks?: boolean;
};

export default function UserProfile({ showEmail = false, showLinks = false }: UserProfileProps) {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/');
    } catch (error) {
      console.error('ログアウトに失敗しました:', error);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <Container size="1" className="px-6 py-8">
      <Flex direction="column" align="center" gap="4" className="mb-8">
        <Avatar
          size="7"
          src={user.photoURL || undefined}
          fallback={user.displayName?.[0] || user.email?.[0] || 'U'}
          style={{ backgroundColor: '#00ADB5', color: 'white' }}
        />
        <Heading size="6" color="gray">
          {user.displayName || '名前未設定'}
        </Heading>
        {showEmail && (
          <Text size="3" color="gray">
            {user.email}
          </Text>
        )}
      </Flex>

      {showLinks && (
        <Flex direction="column" gap="4">
          <Link href="/understood" className="no-underline">
            <Button size="4" className="w-full text-white rounded-lg py-4">
              理解した規約片
            </Button>
          </Link>

          <Link href="/terms" className="no-underline">
            <Button size="4" className="w-full text-white rounded-lg py-4">
              作成した利用規約
            </Button>
          </Link>
        </Flex>
      )}

      <Button
        size="4"
        variant="outline"
        onClick={handleLogout}
        className="w-full border-red-500 text-red-500 hover:bg-red-500 hover:text-white rounded-lg py-4 mt-6"
      >
        ログアウト
      </Button>
    </Container>
  );
}
