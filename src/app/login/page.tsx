"use client";

import { Box, Container } from "@radix-ui/themes";
import Header from "@/components/Organisims/Header";
import { useAuth } from "@/contexts/AuthContext";
import { useRedirectIfLoggedIn } from "@/hooks/useRedirectIfLoggedIn";
import UserProfile from "@/components/Organisims/UserProfile";
import LoginForm from "@/components/Organisims/LoginForm";

export default function LoginPage() {
  const { user } = useAuth();

  useRedirectIfLoggedIn("/");

  return (
    <Box className="min-h-screen">
      <Header showUserIcon={true} />
      <Container size="1" className="px-6 py-8">
        {user ? <UserProfile /> : <LoginForm />}
      </Container>
    </Box>
  );
}
