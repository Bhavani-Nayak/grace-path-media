"use client";

import { useState, useCallback } from "react";

interface DownloadItem {
  productId: string;
  title: string;
  coverUrl: string;
}

export function useDownloadsViewModel() {
  const [user] = useState<any>(null);
  const [purchases] = useState<DownloadItem[]>([]);
  const [isLoading] = useState(false);
  const [error] = useState<string | null>(null);

  const getDownloadUrl = useCallback(
    async (productId: string): Promise<string | null> => {
      return `/images/${productId}.pdf`;
    },
    []
  );

  return {
    user,
    purchases,
    isLoading,
    error,
    getDownloadUrl,
  };
}

