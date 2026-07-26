"use client";

import { useBlogViewModel } from "@/viewmodels/useBlogViewModel";
import BlogListView from "@/components/views/BlogListView";

export default function BlogPage() {
  const vm = useBlogViewModel();
  return <BlogListView {...vm} />;
}
