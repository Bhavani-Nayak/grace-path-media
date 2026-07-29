import type { BlogPost } from "@/models/blog-post";
import { HARDCODED_BLOG_POSTS } from "@/lib/blog-data";

export async function getBlogPosts(): Promise<BlogPost[]> {
  return HARDCODED_BLOG_POSTS;
}

export async function getBlogPostBySlug(
  slug: string
): Promise<BlogPost | null> {
  return HARDCODED_BLOG_POSTS.find((p) => p.slug === slug) ?? null;
}

