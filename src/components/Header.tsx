"use client";

import { Box, Flex, Heading, Avatar, Button } from "@radix-ui/themes";
import Image from "next/image";
import Link from "next/link";
import { useUser } from "@/contexts/AuthContext";

type HeaderProps = {
  showNumber?: boolean;
  number?: string;
  showUserIcon?: boolean;
};

export default function Header({
  showNumber = false,
  number = "4",
  showUserIcon = false,
}: HeaderProps) {
  const user = useUser();

  return (
    <Box asChild className="border-b px-4 py-3">
      <header>
        <Flex align="center" justify="between">
          {/* Left side - Logo */}
          <Flex align="center" gap="2">
            <Link href="/" className="no-underline">
              <Box
                width="32px"
                height="32px"
                className="flex items-center justify-center cursor-pointer"
              >
                <Image src="/Douit.svg" alt="Douit Logo" width={24} height={24} />
              </Box>
            </Link>
          </Flex>

          {/* Center - Title */}
          <Link href="/" className="no-underline">
            <Heading size="5" weight="bold" color="gray" className="cursor-pointer">
              Douit
            </Heading>
          </Link>

          {/* Right side - User Authentication */}
          <Box className="flex items-center justify-center min-w-[80px]">
            {user ? (
              // ログイン済み - ユーザーアイコンまたは指定されたUI
              showUserIcon ? (
                <Link href="/user" className="no-underline">
                  <Avatar
                    size="2"
                    src={user.photoURL || undefined}
                    fallback={user.displayName?.[0] || user.email?.[0] || "U"}
                    style={{ backgroundColor: "#00ADB5", color: "white" }}
                    className="cursor-pointer"
                  />
                </Link>
              ) : showNumber ? (
                <Link href="/user" className="no-underline">
                  <Avatar
                    size="2"
                    fallback={number}
                    style={{ backgroundColor: "#00ADB5", color: "white" }}
                    className="cursor-pointer"
                  />
                </Link>
              ) : (
                <Link href="/user" className="no-underline">
                  <Avatar
                    size="2"
                    src={user.photoURL || undefined}
                    fallback={user.displayName?.[0] || user.email?.[0] || "U"}
                    style={{ backgroundColor: "#00ADB5", color: "white" }}
                    className="cursor-pointer"
                  />
                </Link>
              )
            ) : (
              // 未ログイン - ログインボタン
              <Link href="/login" className="no-underline">
                <Button
                  size="2"
                  variant="outline"
                  className="text-[#00ADB5] border-[#00ADB5] hover:bg-[#00ADB5] hover:text-white"
                >
                  ログイン
                </Button>
              </Link>
            )}
          </Box>
        </Flex>
      </header>
    </Box>
  );
}
