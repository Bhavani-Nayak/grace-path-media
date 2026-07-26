"use client";

import PageWrapper from "@/components/layout/PageWrapper";
import GlassCard from "@/components/ui/GlassCard";
import Badge from "@/components/ui/Badge";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import ErrorMessage from "@/components/ui/ErrorMessage";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Calendar, User } from "lucide-react";
import type { BlogPost } from "@/models/blog-post";

interface BlogPostViewProps {
  post: BlogPost | null;
  isLoading: boolean;
  error: string | null;
}

export default function BlogPostView({ post, isLoading, error }: BlogPostViewProps) {
  if (isLoading) {
    return (
      <PageWrapper>
        <LoadingSpinner className="py-32" />
      </PageWrapper>
    );
  }

  if (error || !post) {
    return (
      <PageWrapper>
        <div className="max-w-2xl mx-auto px-6 py-32 space-y-6 text-center">
          <ErrorMessage message={error ?? "Article not found"} />
          <Link href="/blog" className="inline-flex items-center gap-2 text-sm font-bold text-[#c5a059] hover:underline">
            <ArrowLeft size={16} /> Back to Articles
          </Link>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <article className="max-w-4xl mx-auto px-6 py-16 space-y-8">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-xs font-bold text-[#c5a059] uppercase tracking-wider hover:underline"
        >
          <ArrowLeft size={14} /> Back to Reflections
        </Link>

        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <Badge key={tag} variant="gold">
                {tag}
              </Badge>
            ))}
          </div>
          <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-[#1a1d20] tracking-tight leading-tight">
            {post.title}
          </h1>
          <div className="flex items-center gap-4 text-xs font-medium text-[var(--color-text-muted)] pt-1">
            <span className="flex items-center gap-1.5">
              <User size={14} className="text-[#c5a059]" />
              {post.author}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <Calendar size={14} className="text-[#c5a059]" />
              {new Date(post.publishedAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>
        </div>

        {post.coverUrl && (
          <div className="relative w-full aspect-video rounded-3xl overflow-hidden border border-[#c5a059]/30 shadow-xl bg-slate-100">
            <Image
              src={post.coverUrl}
              alt={post.title}
              fill
              className="object-cover"
              unoptimized
            />
          </div>
        )}

        <GlassCard className="p-8 sm:p-12 border border-[#c5a059]/30 bg-white shadow-xl">
          <div
            className="prose prose-slate max-w-none
              prose-headings:font-heading prose-headings:text-[#1a1d20] prose-headings:font-bold
              prose-p:text-[#4a505a] prose-p:leading-relaxed prose-p:font-normal prose-p:text-base
              prose-li:text-[#4a505a] prose-li:my-1
              prose-blockquote:border-l-4 prose-blockquote:border-[#c5a059] prose-blockquote:bg-[#FAF5E8] prose-blockquote:py-3 prose-blockquote:px-5 prose-blockquote:rounded-r-xl prose-blockquote:italic prose-blockquote:text-[#1a1d20]
              prose-strong:text-[#1a1d20] prose-a:text-[#c5a059] prose-a:underline hover:prose-a:text-[#b38f38]"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </GlassCard>
      </article>
    </PageWrapper>
  );
}


