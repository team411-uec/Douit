"use client";

import { Box, Flex, Heading, Button, Container, Avatar, Text } from "@radix-ui/themes";
import Header from "@/components/Header";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

export default function UserPage() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/");
    } catch (error) {
      console.error("ログアウトに失敗しました:", error);
    }
  };

  if (!user) {
    return (
      <Box className="min-h-screen">
        <Header />
        <Container size="1" className="px-6 py-8">
          <Box className="text-center py-8">
            <Heading size="4" color="gray">
              ログインが必要です
            </Heading>
            <Link href="/login">
              <Button className="mt-4 bg-[#00ADB5] hover:bg-[#009AA2] text-white">
                ログインページへ
              </Button>
            </Link>
          </Box>
        </Container>
      </Box>
    );
  }
  return (
    <Box className="min-h-screen">
      <Header />

      <Container size="1" className="px-6 py-8">
        {/* Profile Section */}
        <Flex direction="column" align="center" gap="4" className="mb-8">
          <Avatar
            size="7"
            src={user.photoURL || undefined}
            fallback={user.displayName?.[0] || user.email?.[0] || "U"}
            style={{ backgroundColor: "#00ADB5", color: "white" }}
          />
          <Heading size="6" color="gray">
            {user.displayName || "名前未設定"}
          </Heading>
          <Text size="3" color="gray">
            {user.email}
          </Text>
        </Flex>

        {/* Menu Buttons */}
        <Flex direction="column" gap="4">
          <Link href="/understood" className="no-underline">
            <Button
              size="4"
              className="w-full bg-[#00ADB5] hover:bg-[#009AA2] text-white rounded-lg py-4"
            >
              理解した規約片
            </Button>
          </Link>

          <Link href="/terms" className="no-underline">
            <Button
              size="4"
              className="w-full bg-[#00ADB5] hover:bg-[#009AA2] text-white rounded-lg py-4"
            >
              作成した利用規約
            </Button>
          </Link>

          <Button
            size="4"
            variant="outline"
            onClick={handleLogout}
            className="w-full border-red-500 text-red-500 hover:bg-red-500 hover:text-white rounded-lg py-4 mt-6"
          >
            ログアウト
          </Button>
        </Flex>
      </Container>
    </Box>
  );
}
