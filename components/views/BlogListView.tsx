"use client";

import PageWrapper from "@/components/layout/PageWrapper";
import GlassCard from "@/components/ui/GlassCard";
import Badge from "@/components/ui/Badge";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import ErrorMessage from "@/components/ui/ErrorMessage";
import Link from "next/link";
import Image from "next/image";
import { Sparkles, Calendar, User, ArrowRight } from "lucide-react";
import type { BlogPost } from "@/models/blog-post";

interface BlogListViewProps {
  posts: BlogPost[];
  isLoading: boolean;
  error: string | null;
}

export default function BlogListView({ posts, isLoading, error }: BlogListViewProps) {
  return (
    <PageWrapper>
      <div className="max-w-5xl mx-auto px-6 py-20 space-y-12">
        <div className="space-y-4 max-w-2xl">
          <Badge variant="gold" className="gap-1.5">
            <Sparkles size={14} className="text-[#c5a059]" />
            Faith & Journal
          </Badge>
          <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl font-bold text-[#1a1d20] tracking-tight">
            Reflections & Articles
          </h1>
          <p className="text-[var(--color-text-secondary)] text-base sm:text-lg font-normal leading-relaxed">
            Free faith reflections, devotionals, and biblical articles for anyone seeking quiet strength and thoughtful words.
          </p>
        </div>

        {isLoading && <LoadingSpinner className="py-20" />}
        {error && <ErrorMessage message={error} />}

        {!isLoading && !error && posts.length === 0 && (
          <GlassCard className="p-12 text-center border border-[#c5a059]/30 bg-white">
            <p className="text-[var(--color-text-muted)] font-normal">
              No articles available right now. Check back soon!
            </p>
          </GlassCard>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {posts.map((post) => (
            <Link key={post.id} href={`/blog/${post.slug}`} className="block group h-full">
              <GlassCard className="p-0 border border-[#c5a059]/30 bg-white shadow-md hover-gold-glow overflow-hidden h-full flex flex-col justify-between transition-all duration-300">
                <div>
                  {post.coverUrl && (
                    <div className="relative w-full h-48 bg-slate-100 overflow-hidden">
                      <Image
                        src={post.coverUrl}
                        alt={post.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        unoptimized
                      />
                    </div>
                  )}
                  <div className="p-6 sm:p-8 space-y-4">
                    <div className="flex flex-wrap gap-2">
                      {post.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="gold" className="text-[10px]">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <h2 className="font-heading text-2xl font-bold text-[#1a1d20] group-hover:text-[#c5a059] transition-colors leading-snug">
                      {post.title}
                    </h2>

                    <p className="text-sm text-[var(--color-text-secondary)] line-clamp-3 font-normal leading-relaxed">
                      {post.excerpt}
                    </p>
                  </div>
                </div>

                <div className="px-6 sm:px-8 pb-6 pt-2 border-t border-black/5 flex items-center justify-between text-xs text-[var(--color-text-muted)] font-medium">
                  <span className="flex items-center gap-1.5">
                    <User size={13} className="text-[#c5a059]" />
                    {post.author}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Calendar size={13} className="text-[#c5a059]" />
                    {new Date(post.publishedAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                  <span className="text-[#c5a059] flex items-center gap-1 group-hover:translate-x-1 transition-transform font-bold">
                    Read Article <ArrowRight size={13} />
                  </span>
                </div>
              </GlassCard>
            </Link>
          ))}
        </div>
      </div>
    </PageWrapper>
  );
}


