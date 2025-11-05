import { useState } from 'react';
import { Box, Flex, Heading, Button, TextField, Text } from '@radix-ui/themes';
import { GoogleIcon } from '@/components/ui/GoogleIcon';
import { useAuth } from '@/features/auth/contexts/AuthContext';

export default function LoginForm() {
  const { signIn, signUp, signInWithGoogle } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSignUp, setIsSignUp] = useState(false);

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
      setError(error.message || `${isSignUp ? 'アカウント作成' : 'ログイン'}に失敗しました`);
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
      setError(error.message || 'Googleログインに失敗しました');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Flex direction="column" align="center" gap="6" className="max-w-md mx-auto">
      <Heading size="6" color="gray" className="mb-4">
        {isSignUp ? 'アカウント作成' : 'ログイン'}
      </Heading>

      {error && (
        <Text color="red" size="2" className="text-center">
          {error}
        </Text>
      )}

      <form onSubmit={handleEmailSignIn} className="w-full space-y-4">
        <TextField.Root
          type="email"
          placeholder="メールアドレス"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full"
        />
        <TextField.Root
          type="password"
          placeholder="パスワード"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full"
        />
        <Button type="submit" size="3" className="w-full text-white" disabled={isLoading}>
          {isLoading
            ? `${isSignUp ? '作成中' : 'ログイン中'}...`
            : isSignUp
              ? 'アカウント作成'
              : 'ログイン'}
        </Button>
      </form>

      <Button variant="ghost" size="2" onClick={() => setIsSignUp(!isSignUp)}>
        {isSignUp ? '既にアカウントをお持ちの方はこちら' : '新規アカウント作成'}
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
        {isLoading ? 'ログイン中...' : 'Googleでログイン'}
      </Button>
    </Flex>
  );
}
