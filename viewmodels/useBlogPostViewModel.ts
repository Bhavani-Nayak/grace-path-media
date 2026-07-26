"use client";

import { useState, useEffect } from "react";
import { getBlogPostBySlug } from "@/services/blog-service";
import type { BlogPost } from "@/models/blog-post";

export function useBlogPostViewModel(slug: string) {
  const [post, setPost] = useState<BlogPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchPost() {
      try {
        setIsLoading(true);
        const data = await getBlogPostBySlug(slug);
        if (!cancelled) {
          setPost(data);
          if (!data) setError("Post not found");
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "Failed to load post"
          );
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    fetchPost();
    return () => { cancelled = true; };
  }, [slug]);

  return { post, isLoading, error };
}
