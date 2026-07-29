"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import type { User } from "@/services/auth-service";

export function useAuthViewModel() {
  const router = useRouter();
  const [user] = useState<User | null>(null);
  const [isLoading] = useState(false);
  const [error] = useState<string | null>(null);

  const handleGoogleSignIn = useCallback(async () => {
    console.warn("Authentication is disabled in static mode.");
  }, []);

  const handleSignOut = useCallback(async () => {
    router.push("/");
  }, [router]);

  const handleDeleteAccount = useCallback(async () => {
    router.push("/");
  }, [router]);

  return {
    user,
    isLoading,
    error,
    signInWithGoogle: handleGoogleSignIn,
    signOut: handleSignOut,
    deleteAccount: handleDeleteAccount,
  };
}

