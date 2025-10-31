"use client";

import { Box } from "@radix-ui/themes";
import Header from "@/components/Organisims/Header";
import { useAuth } from "@/contexts/AuthContext";
import UserProfile from "@/components/Organisims/UserProfile";
import PageStatus from "@/components/Molecules/PageStatus";

export default function UserPage() {
  const { user } = useAuth();

  return (
    <Box className="min-h-screen">
      <Header />
      <PageStatus user={user} loading={false} error={null}>
        <UserProfile showEmail={true} showLinks={true} />
      </PageStatus>
    </Box>
  );
}
