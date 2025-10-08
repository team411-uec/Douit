"use client";

import { Box, Heading, Button, Container } from "@radix-ui/themes";
import Header from "./Header";
import Link from "next/link";
import { useUser } from "@/contexts/AuthContext";
import { ReactNode } from "react";

interface AuthGuardProps {
  children: ReactNode;
  showUserIcon?: boolean;
  showNumber?: boolean;
  number?: string;
}

export default function AuthGuard({
  children,
  showUserIcon = false,
  showNumber = false,
  number = "4",
}: AuthGuardProps) {
  const user = useUser();

  if (!user) {
    return (
      <Box className="min-h-screen">
        <Header showUserIcon={showUserIcon} showNumber={showNumber} number={number} />
        <Container size="1" className="px-6 py-6">
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

  return <>{children}</>;
}
