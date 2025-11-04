'use client';

import { Box, Container } from '@radix-ui/themes';
import Header from '@/components/ui/Header';
import { useAuth } from '@/features/auth/contexts/AuthContext';
import { useRedirectIfLoggedIn } from '@/features/auth/hooks/useRedirectIfLoggedIn';
import UserProfile from '@/features/user/components/UserProfile';
import LoginForm from '@/features/auth/components/LoginForm';

export default function LoginPage() {
  const { user } = useAuth();

  useRedirectIfLoggedIn('/');

  return (
    <Box className="min-h-screen">
      <Header showUserIcon={true} />
      <Container size="1" className="px-6 py-8">
        {user ? <UserProfile /> : <LoginForm />}
      </Container>
    </Box>
  );
}
