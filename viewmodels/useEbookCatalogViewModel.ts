"use client";

import { useState, useEffect } from "react";
import { getEbooks } from "@/services/ebook-service";
import type { Ebook } from "@/models/ebook";

export function useEbookCatalogViewModel() {
  const [ebooks, setEbooks] = useState<Ebook[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchEbooks() {
      try {
        setIsLoading(true);
        const data = await getEbooks();
        if (!cancelled) {
          setEbooks(data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "Failed to load ebooks"
          );
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    fetchEbooks();
    return () => {
      cancelled = true;
    };
  }, []);

  return { ebooks, isLoading, error };
}
