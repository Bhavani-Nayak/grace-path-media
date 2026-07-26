"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  // signIn,
  // signUp,
  signInWithGoogle,
  signOut,
  deleteAccount,
  // sendVerificationEmail,
  // reloadUser,
  onAuthStateChange,
} from "@/services/auth-service";
import { formatAuthError } from "@/lib/firebase-error-parser";
import type { User } from "firebase/auth";

export function useAuthViewModel() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChange((u) => {
      setUser(u);
      setIsLoading(false);
    });
    return unsubscribe;
  }, []);

  /*
  // Email/Password sign in and sign up (commented out - Google auth only)
  const handleSignIn = useCallback(
    async (email: string, password: string) => {
      try {
        setIsLoading(true);
        setError(null);
        await signIn(email, password);
      } catch (err) {
        setError(formatAuthError(err));
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const handleSignUp = useCallback(
    async (email: string, password: string) => {
      try {
        setIsLoading(true);
        setError(null);
        const newUser = await signUp(email, password);
        setUser(newUser);
      } catch (err) {
        setError(formatAuthError(err));
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const handleSendVerificationEmail = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      await sendVerificationEmail();
    } catch (err) {
      setError(formatAuthError(err));
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleReloadUser = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const updated = await reloadUser();
      if (updated) {
        setUser({ ...updated } as User);
      }
      return updated;
    } catch (err) {
      setError(formatAuthError(err));
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);
  */

  const handleGoogleSignIn = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      await signInWithGoogle();
    } catch (err) {
      setError(formatAuthError(err));
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleSignOut = useCallback(async () => {
    try {
      await signOut();
      router.push("/");
    } catch (err) {
      setError(formatAuthError(err));
    }
  }, [router]);

  const handleDeleteAccount = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      await deleteAccount();
      router.push("/");
    } catch (err) {
      const formatted = formatAuthError(err);
      setError(formatted);
      throw new Error(formatted);
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  return {
    user,
    isLoading,
    error,
    // signIn: handleSignIn,
    // signUp: handleSignUp,
    signInWithGoogle: handleGoogleSignIn,
    // sendVerificationEmail: handleSendVerificationEmail,
    // reloadUser: handleReloadUser,
    signOut: handleSignOut,
    deleteAccount: handleDeleteAccount,
  };
}
