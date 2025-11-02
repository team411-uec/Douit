import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/features/auth/contexts/AuthContext";

export function useRedirectIfLoggedIn(redirectPath: string) {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push(redirectPath);
    }
  }, [user, router, redirectPath]);
}
