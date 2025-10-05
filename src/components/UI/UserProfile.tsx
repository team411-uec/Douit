"use client";

import { Flex, Avatar, Heading, Text } from "@radix-ui/themes";

export interface UserData {
  photoURL?: string | null;
  displayName?: string | null;
  email?: string | null;
}

interface UserProfileProps {
  user: UserData;
  className?: string;
}

export default function UserProfile({ user, className = "mb-8" }: UserProfileProps) {
  return (
    <Flex direction="column" align="center" gap="4" className={className}>
      <Avatar
        size="7"
        src={user?.photoURL || undefined}
        fallback={user?.displayName?.[0] || user?.email?.[0] || "U"}
        style={{ backgroundColor: "#00ADB5", color: "white" }}
      />
      <Heading size="6" color="gray">
        {user?.displayName || "名前未設定"}
      </Heading>
      <Text size="3" color="gray">
        {user?.email}
      </Text>
    </Flex>
  );
}
