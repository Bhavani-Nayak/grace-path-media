"use client";

import { useState, useEffect } from "react";
import { getBlogPosts } from "@/services/blog-service";
import type { BlogPost } from "@/models/blog-post";

export function useBlogViewModel() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchPosts() {
      try {
        setIsLoading(true);
        const data = await getBlogPosts();
        if (!cancelled) setPosts(data);
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "Failed to load blog posts"
          );
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    fetchPosts();
    return () => { cancelled = true; };
  }, []);

  return { posts, isLoading, error };
}
