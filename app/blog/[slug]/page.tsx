"use client";

import { use } from "react";
import { useBlogPostViewModel } from "@/viewmodels/useBlogPostViewModel";
import BlogPostView from "@/components/views/BlogPostView";

export default function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const vm = useBlogPostViewModel(slug);
  return <BlogPostView {...vm} />;
}
