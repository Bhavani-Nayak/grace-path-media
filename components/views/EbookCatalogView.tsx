"use client";

import PageWrapper from "@/components/layout/PageWrapper";
import GlassCard from "@/components/ui/GlassCard";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import ErrorMessage from "@/components/ui/ErrorMessage";
import Image from "next/image";
import { Sparkles, BookOpen, Clock } from "lucide-react";
import TrustBadges from "@/components/ui/TrustBadges";
import type { Ebook } from "@/models/ebook";

interface EbookCatalogViewProps {
  ebooks: Ebook[];

  isLoading: boolean;
  error: string | null;
}

export default function EbookCatalogView({
  ebooks,
  isLoading,
  error,
}: EbookCatalogViewProps) {
  return (
    <PageWrapper>
      <div className="max-w-6xl mx-auto px-6 py-20 space-y-12">
        <div className="space-y-6">
          <div className="space-y-3 max-w-2xl">
            <Badge variant="gold" className="gap-1.5">
              <Sparkles size={14} className="text-[#c5a059]" />
              Digital Faith Publications
            </Badge>
            <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl font-bold text-[#1a1d20] tracking-tight">
              Ebooks & Publications
            </h1>
            <p className="text-[var(--color-text-secondary)] text-base sm:text-lg font-normal leading-relaxed">
              Scripture-centered publications and devotionals — own them outright with instant PDF download access.
            </p>
          </div>

          <TrustBadges variant="horizontal" />
        </div>

        {isLoading && <LoadingSpinner className="py-20" />}
        {error && <ErrorMessage message={error} />}

        {!isLoading && !error && ebooks.length === 0 && (
          <GlassCard className="p-12 text-center border border-[#c5a059]/30 bg-white shadow-md">
            <p className="text-[var(--color-text-muted)] font-normal">
              No ebooks available right now. Check back soon!
            </p>
          </GlassCard>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {ebooks.map((ebook) => (
            <GlassCard key={ebook.id} className="group p-0 overflow-hidden border border-[#c5a059]/30 bg-white shadow-md hover-gold-glow flex flex-col justify-between transition-all duration-300">
              <div>
                {/* Cover image */}
                <div className="aspect-[3/4] bg-slate-50 border-b border-black/10 relative overflow-hidden flex items-center justify-center p-4">
                  {ebook.coverUrl ? (
                    <div className="relative w-full h-full rounded-lg overflow-hidden shadow-lg group-hover:scale-105 transition-transform duration-500">
                      <Image
                        src={ebook.coverUrl}
                        alt={ebook.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-contain"
                        unoptimized
                      />
                    </div>
                  ) : (
                    <span className="font-heading text-6xl text-[#c5a059]/30 font-bold">
                      {ebook.title.charAt(0)}
                    </span>
                  )}
                  <div className="absolute top-3 right-3 z-10">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#c5a059] text-white shadow-md">
                      {ebook.isPayWhatYouWant ? "Pay What You Want" : `$${(ebook.price / 100).toFixed(2)}`}
                    </span>
                  </div>

                </div>

                <div className="p-6 space-y-3">
                  <div className="flex flex-wrap gap-1.5">
                    {ebook.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="gold" className="text-[10px]">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <h2 className="font-heading text-2xl font-bold text-[#1a1d20] group-hover:text-[#c5a059] transition-colors leading-snug">
                    {ebook.title}
                  </h2>

                  <p className="text-xs text-[var(--color-text-muted)] font-medium flex items-center gap-3">
                    <span className="flex items-center gap-1"><BookOpen size={13} className="text-[#c5a059]" /> {ebook.pageCount} Pages</span>
                    <span>•</span>
                    <span className="flex items-center gap-1"><Clock size={13} className="text-[#c5a059]" /> {ebook.readingTime}</span>
                  </p>

                  <p className="text-sm text-[var(--color-text-secondary)] line-clamp-3 font-normal leading-relaxed">
                    {ebook.shortDescription}
                  </p>
                </div>
              </div>

              <div className="px-6 pb-6 pt-2">
                <Button href={`/ebooks/${ebook.slug}`} variant="gold" size="md" className="w-full">
                  View Details & Buy
                </Button>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    </PageWrapper>
  );
}



