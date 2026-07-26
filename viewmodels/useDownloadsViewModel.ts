"use client";

import { useState, useEffect, useCallback } from "react";
import { onAuthStateChange } from "@/services/auth-service";
import type { User } from "firebase/auth";

interface DownloadItem {
  productId: string;
  title: string;
  coverUrl: string;
}

export function useDownloadsViewModel() {
  const [user, setUser] = useState<User | null>(null);
  const [purchases, setPurchases] = useState<DownloadItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChange((u) => {
      setUser(u);
      if (!u) {
        setPurchases([]);
        setIsLoading(false);
      }
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!user) return;

    let cancelled = false;

    async function fetchPurchases() {
      try {
        setIsLoading(true);
        // Fetch the user's purchases via a client-safe API or directly from Firestore
        // For now this is a placeholder that would read from purchases/{uid}/items
        const res = await fetch(`/api/downloads/list`, {
          headers: {
            Authorization: `Bearer ${await user?.getIdToken()}`,
          },
        });

        if (res.ok) {
          const data = await res.json();
          if (!cancelled) {
            setPurchases(data.purchases ?? []);
          }
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "Failed to load downloads"
          );
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    fetchPurchases();
    return () => {
      cancelled = true;
    };
  }, [user]);

  const getDownloadUrl = useCallback(
    async (productId: string): Promise<string | null> => {
      if (!user) return null;

      try {
        const token = await user.getIdToken();
        const res = await fetch(`/api/downloads/${productId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          throw new Error("Failed to get download link");
        }

        const data = await res.json();
        return data.url as string;
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to generate download"
        );
        return null;
      }
    },
    [user]
  );

  return {
    user,
    purchases,
    isLoading,
    error,
    getDownloadUrl,
  };
}
