"use client";

import { useState, useEffect } from "react";
import { getEbookBySlug } from "@/services/ebook-service";
import { onAuthStateChange } from "@/services/auth-service";
import type { Ebook } from "@/models/ebook";
import type { User } from "firebase/auth";

export function useEbookDetailViewModel(slug: string) {
  const [user, setUser] = useState<User | null>(null);
  const [isOwned, setIsOwned] = useState<boolean>(false);
  const [ebook, setEbook] = useState<Ebook | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChange((u) => {
      setUser(u);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function fetchEbookAndOwnership() {
      try {
        setIsLoading(true);
        const data = await getEbookBySlug(slug);
        if (!cancelled) {
          setEbook(data);
          if (!data) setError("Ebook not found");
        }

        if (data && user) {
          try {
            const token = await user.getIdToken();
            const res = await fetch(`/api/downloads/verify?uid=${user.uid}&ebookId=${data.id}`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            if (res.ok) {
              const verifyData = await res.json();
              if (!cancelled) {
                setIsOwned(Boolean(verifyData.owned));
              }
            }
          } catch {
            // Ownership check error
          }
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "Failed to load ebook"
          );
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    fetchEbookAndOwnership();
    return () => {
      cancelled = true;
    };
  }, [slug, user]);

  return { ebook, user, isOwned, isLoading, error };
}
