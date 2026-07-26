"use client";

import { useState, useEffect } from "react";
import { onAuthStateChange, getCurrentUser } from "@/services/auth-service";
import type { User } from "firebase/auth";

interface DownloadState {
  isLoading: boolean;
  user: User | null;
  isOwned: boolean;
  downloadUrl: string | null;
  title: string | null;
  error: string | null;
  invoiceUrl: string | null;
}

export function useDownloadViewModel(slug: string, token: string | null) {
  const [state, setState] = useState<DownloadState>({
    isLoading: true,
    user: getCurrentUser(),
    isOwned: false,
    downloadUrl: null,
    title: null,
    error: null,
    invoiceUrl: null,
  });

  useEffect(() => {
    let isCancelled = false;

    const unsubscribe = onAuthStateChange((user) => {
      if (isCancelled) return;

      const checkAccess = async () => {
        setState((prev) => ({ ...prev, isLoading: true, user }));

        try {
          const params = new URLSearchParams();
          params.set("ebookId", slug);
          if (user) params.set("uid", user.uid);
          if (token) params.set("token", token);

          const res = await fetch(`/api/downloads/verify?${params.toString()}`);
          const data = await res.json();

          if (!res.ok || !data.owned) {
            if (!isCancelled) {
              setState((prev) => ({
                ...prev,
                isLoading: false,
                isOwned: false,
                error: data.error || "Purchase not found for this user account.",
              }));
            }
            return;
          }

          if (!isCancelled) {
            setState((prev) => ({
              ...prev,
              isLoading: false,
              isOwned: true,
              downloadUrl: data.downloadUrl,
              title: data.title,
              error: null,
              invoiceUrl: token ? `/api/invoices/${token}?format=html&uid=${user?.uid || 'guest'}` : null,
            }));
          }
        } catch (err) {
          if (!isCancelled) {
            setState((prev) => ({
              ...prev,
              isLoading: false,
              isOwned: false,
              error: "Failed to verify purchase.",
            }));
          }
        }
      };

      checkAccess();
    });

    return () => {
      isCancelled = true;
      unsubscribe();
    };
  }, [slug, token]);

  return state;
}
