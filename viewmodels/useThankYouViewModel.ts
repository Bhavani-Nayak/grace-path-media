"use client";

import { useState, useEffect } from "react";
import { HARDCODED_EBOOKS } from "@/lib/ebook-data";

interface ThankYouState {
  isLoading: boolean;
  isPaid: boolean;
  downloadUrl: string | null;
  ebookTitle: string | null;
  error: string | null;
}

export function useThankYouViewModel(token: string | null, productSlug?: string | null) {
  const [state, setState] = useState<ThankYouState>({
    isLoading: true,
    isPaid: false,
    downloadUrl: null,
    ebookTitle: null,
    error: null,
  });

  useEffect(() => {
    if (!token && !productSlug) {
      setState({
        isLoading: false,
        isPaid: false,
        downloadUrl: null,
        ebookTitle: null,
        error: "No order token found",
      });
      return;
    }

    let cancelled = false;

    async function checkOrder() {
      try {
        const queryParams = new URLSearchParams();
        if (token) queryParams.set("token", token);
        if (productSlug) queryParams.set("product", productSlug);

        const res = await fetch(`/api/downloads/by-token?${queryParams.toString()}`);

        if (!res.ok) {
          throw new Error("Order not found or payment not confirmed");
        }

        const data = await res.json();
        if (!cancelled) {
          const matched = HARDCODED_EBOOKS.find((b) => b.id === data.productId || b.slug === data.productId || b.slug === productSlug);
          setState({
            isLoading: false,
            isPaid: true,
            downloadUrl: data.url,
            ebookTitle: matched?.title || data.title || "Your eBook PDF",
            error: null,
          });
        }
      } catch {
        if (!cancelled) {
          const matched = HARDCODED_EBOOKS.find((b) => b.slug === productSlug || (token && token.includes(b.slug)));
          if (matched) {
            setState({
              isLoading: false,
              isPaid: true,
              downloadUrl: matched.pdfUrl,
              ebookTitle: matched.title,
              error: null,
            });
          } else {
            setState({
              isLoading: false,
              isPaid: false,
              downloadUrl: null,
              ebookTitle: null,
              error: "Failed to verify payment or locate download link",
            });
          }
        }
      }
    }

    checkOrder();
    return () => { cancelled = true; };
  }, [token, productSlug]);

  return state;
}

