"use client";

import { Box, Flex, Heading, Button, Container, Avatar, TextField, Text } from "@radix-ui/themes";
import Header from "@/components/Header";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { GoogleIcon } from "@/components/Atoms/GoogleIcon";

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
              <GoogleIcon />
            </Box>
            {isLoading ? "ログイン中..." : "Googleでログイン"}
          </Button>
        </Flex>
      </Container>
    </Box>
  );
}
