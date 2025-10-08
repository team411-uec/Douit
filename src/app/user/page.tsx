"use client";

import AuthGuard from "@/components/AuthGuard";
import PageLayout from "@/components/Layout/PageLayout";
import UserMenu from "@/components/UI/UserMenu";
import UserProfile from "@/components/UI/UserProfile";
import { useUser, useAuthActions } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

export default function UserPage() {
  const user = useUser();
  const { logout } = useAuthActions();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/");
    } catch (error) {
      console.error("ログアウトに失敗しました:", error);
    }
  };

  return (
    <AuthGuard>
      <PageLayout padding="px-6 py-8">
        {/* Profile Section */}
        <UserProfile user={user || {}} />

        {/* Menu Buttons */}
        <UserMenu onLogout={handleLogout} />
      </PageLayout>
    </AuthGuard>
  );
}
