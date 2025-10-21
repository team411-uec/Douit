"use client";

import { Box, Flex, Heading, Button, Container, Avatar, TextField, Text } from "@radix-ui/themes";
import Header from "@/components/Header";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const { user, signIn, signUp, signInWithGoogle, logout } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSignUp, setIsSignUp] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push("/");
    }
  }, [user, router]);

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (isSignUp) {
        await signUp(email, password);
      } else {
        await signIn(email, password);
      }
    } catch (error: any) {
      setError(error.message || `${isSignUp ? "アカウント作成" : "ログイン"}に失敗しました`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError(null);

    try {
      await signInWithGoogle();
    } catch (error: any) {
      setError(error.message || "Googleログインに失敗しました");
    } finally {
      setIsLoading(false);
    }
  };

  if (user) {
    return (
      <Box className="min-h-screen">
        <Header showUserIcon={true} />
        <Container size="1" className="px-6 py-8">
          <Flex direction="column" align="center" gap="4" className="mb-16">
            <Avatar
              size="7"
              src={user.photoURL || undefined}
              fallback={user.displayName?.[0] || user.email?.[0] || "U"}
              style={{ backgroundColor: "#00ADB5", color: "white" }}
            />
            <Heading size="6" color="gray">
              {user.displayName || user.email}
            </Heading>
            <Button size="3" variant="outline" onClick={logout} className="mt-4">
              ログアウト
            </Button>
          </Flex>
        </Container>
      </Box>
    );
  }

  return (
    <Box className="min-h-screen">
      <Header showUserIcon={true} />

      <Container size="1" className="px-6 py-8">
        {/* Login Form */}
        <Flex direction="column" align="center" gap="6" className="max-w-md mx-auto">
          <Heading size="6" color="gray" className="mb-4">
            {isSignUp ? "アカウント作成" : "ログイン"}
          </Heading>

          {error && (
            <Text color="red" size="2" className="text-center">
              {error}
            </Text>
          )}

          {/* Email/Password Form */}
          <form onSubmit={handleEmailSignIn} className="w-full space-y-4">
            <TextField.Root
              type="email"
              placeholder="メールアドレス"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="w-full"
            />
            <TextField.Root
              type="password"
              placeholder="パスワード"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              className="w-full"
            />
            <Button
              type="submit"
              size="3"
              className="w-full bg-[#00ADB5] hover:bg-[#009AA2] text-white"
              disabled={isLoading}
            >
              {isLoading
                ? `${isSignUp ? "作成中" : "ログイン中"}...`
                : isSignUp
                  ? "アカウント作成"
                  : "ログイン"}
            </Button>
          </form>

          {/* Toggle Sign Up / Sign In */}
          <Button
            variant="ghost"
            size="2"
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-[#00ADB5] hover:bg-[#00ADB5]/10"
          >
            {isSignUp ? "既にアカウントをお持ちの方はこちら" : "新規アカウント作成"}
          </Button>

          <Box className="w-full">
            <Flex align="center" gap="3" className="my-4">
              <Box className="flex-1 h-px bg-gray-300"></Box>
              <Text size="2" color="gray">
                または
              </Text>
              <Box className="flex-1 h-px bg-gray-300"></Box>
            </Flex>
          </Box>

          {/* Google Sign In Button */}
          <Button
            size="3"
            variant="surface"
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="w-full bg-white border border-gray-300 text-gray-900 shadow-sm hover:shadow-md px-6 py-3"
          >
            <Box className="mr-3">
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
            </Box>
            {isLoading ? "ログイン中..." : "Googleでログイン"}
          </Button>
        </Flex>
      </Container>
    </Box>
  );
}
