"use client";

import { useState } from "react";
import PageWrapper from "@/components/layout/PageWrapper";
import GlassCard from "@/components/ui/GlassCard";
import Badge from "@/components/ui/Badge";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import ErrorMessage from "@/components/ui/ErrorMessage";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  BookOpen,
  Clock,
  FileText,
  Download,
  ShieldCheck,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Eye,
  Maximize2,
  X,
} from "lucide-react";
import type { Ebook } from "@/models/ebook";
import type { User } from "firebase/auth";

interface EbookDetailViewProps {
  ebook: Ebook | null;
  isLoading: boolean;
  error: string | null;
  checkoutSlot?: React.ReactNode;
  customPriceDisplay?: string;
  isOwned?: boolean;
  user?: User | null;
}

export default function EbookDetailView({
  ebook,
  isLoading,
  error,
  checkoutSlot,
  customPriceDisplay,
  isOwned = false,
  user = null,
}: EbookDetailViewProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState<boolean>(false);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);

  if (isLoading) {
    return (
      <PageWrapper>
        <LoadingSpinner className="py-32" />
      </PageWrapper>
    );
  }

  if (error || !ebook) {
    return (
      <PageWrapper>
        <div className="max-w-2xl mx-auto px-6 py-32 space-y-6 text-center">
          <ErrorMessage message={error ?? "Ebook not found"} />
          <Link
            href="/ebooks"
            className="inline-flex items-center gap-2 text-sm font-bold text-[#c5a059] hover:underline"
          >
            <ArrowLeft size={16} /> Back to Catalog
          </Link>
        </div>
      </PageWrapper>
    );
  }

  // Combine cover image + sample page screenshots into gallery array
  const galleryItems = [
    { type: "cover", label: "Cover", url: ebook.coverUrl },
    ...(ebook.screenshots || []).map((url, idx) => ({
      type: "screenshot",
      label: `Page ${idx + 1}`,
      url,
    })),
  ];

  const currentItem = galleryItems[selectedImageIndex] || galleryItems[0];

  const handlePrevImage = () => {
    setSelectedImageIndex(
      (prev) => (prev - 1 + galleryItems.length) % galleryItems.length
    );
  };

  const handleNextImage = () => {
    setSelectedImageIndex((prev) => (prev + 1) % galleryItems.length);
  };

  return (
    <PageWrapper>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16 space-y-8">
        <Link
          href="/ebooks"
          className="inline-flex items-center gap-2 text-xs font-bold text-[#c5a059] uppercase tracking-wider hover:underline"
        >
          <ArrowLeft size={14} /> Back to Ebooks Catalog
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Interactive Main Image Display + Thumbnail Strip Underneath */}
          <div className="lg:col-span-5 space-y-4 flex flex-col items-center">
            {/* Main Cover / Screenshot Card */}
            <GlassCard className="p-3.5 border border-[#c5a059]/30 bg-white shadow-2xl rounded-3xl w-full max-w-md relative group">
              <div
                onClick={() => setIsLightboxOpen(true)}
                className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden bg-slate-50 border border-black/5 shadow-md cursor-pointer"
                title="Click to expand full screen preview"
              >
                {currentItem.url ? (
                  <Image
                    src={currentItem.url}
                    alt={`${ebook.title} - ${currentItem.label}`}
                    fill
                    sizes="(max-width: 1024px) 100vw, 450px"
                    className="object-contain transition-transform duration-300 group-hover:scale-[1.02]"
                    unoptimized
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center font-heading text-8xl font-bold text-[#c5a059]/40">
                    {ebook.title.charAt(0)}
                  </div>
                )}

                {/* Hover overlay hint */}
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center text-white gap-2 backdrop-blur-[2px]">
                  <div className="p-3 rounded-full bg-white/90 text-[#1a1d20] shadow-lg">
                    <Maximize2 size={20} className="text-[#c5a059]" />
                  </div>
                  <span className="text-xs font-bold bg-black/60 px-3 py-1 rounded-full border border-white/20">
                    Click to Enlarge
                  </span>
                </div>
              </div>
            </GlassCard>

            {/* Thumbnail Selector Carousel Strip (Matches user screenshot) */}
            {galleryItems.length > 1 && (
              <div className="w-full max-w-md space-y-2">
                <div className="flex items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={handlePrevImage}
                    className="p-1.5 rounded-full border border-[#c5a059]/40 bg-white text-[#1a1d20] hover:bg-[#c5a059] hover:text-white transition-all shadow-sm shrink-0"
                    aria-label="Previous sample image"
                  >
                    <ChevronLeft size={16} />
                  </button>

                  <div className="flex items-center gap-2 overflow-x-auto py-1 px-1 no-scrollbar">
                    {galleryItems.map((item, idx) => {
                      const isSelected = selectedImageIndex === idx;
                      return (
                        <button
                          key={item.url + idx}
                          type="button"
                          onClick={() => setSelectedImageIndex(idx)}
                          className={`relative h-20 w-15 sm:h-22 sm:w-16 rounded-xl overflow-hidden border-2 transition-all shrink-0 bg-slate-100 shadow-sm ${
                            isSelected
                              ? "border-[#c5a059] ring-2 ring-[#c5a059]/40 scale-105"
                              : "border-black/10 opacity-70 hover:opacity-100 hover:border-[#c5a059]/50"
                          }`}
                        >
                          <Image
                            src={item.url}
                            alt={item.label}
                            fill
                            sizes="80px"
                            className="object-cover"
                            unoptimized
                          />
                          <span className="absolute bottom-0 inset-x-0 bg-black/70 text-[9px] font-bold text-white text-center py-0.5 truncate">
                            {item.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  <button
                    type="button"
                    onClick={handleNextImage}
                    className="p-1.5 rounded-full border border-[#c5a059]/40 bg-white text-[#1a1d20] hover:bg-[#c5a059] hover:text-white transition-all shadow-sm shrink-0"
                    aria-label="Next sample image"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>

                <p className="text-center text-xs font-semibold text-[var(--color-text-secondary)] flex items-center justify-center gap-1.5 pt-1">
                  <Eye size={14} className="text-[#c5a059]" />
                  <span>
                    Preview {galleryItems.length} sample pages (Click image to expand)
                  </span>
                </p>
              </div>
            )}
          </div>

          {/* Right Column: Ebook Information & Checkout */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex flex-wrap gap-2">
              {ebook.tags.map((tag) => (
                <Badge key={tag} variant="gold">
                  {tag}
                </Badge>
              ))}
            </div>

            <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-[#1a1d20] tracking-tight leading-tight">
              {ebook.title}
            </h1>

            <div className="flex flex-wrap items-center gap-3 text-xs font-medium text-[var(--color-text-muted)] bg-[#FAF5E8] border border-[#c5a059]/30 p-3 rounded-xl">
              <span className="flex items-center gap-1.5">
                <BookOpen size={14} className="text-[#c5a059]" />
                {ebook.pageCount} Pages
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Clock size={14} className="text-[#c5a059]" />
                {ebook.readingTime}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <FileText size={14} className="text-[#c5a059]" />
                PDF Digital Book
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5 text-[#c5a059] font-bold">
                <Sparkles size={14} />
                Instant Download
              </span>
            </div>

            <p className="text-[var(--color-text-secondary)] leading-relaxed text-base font-normal">
              {ebook.description}
            </p>

            <div className="p-6 rounded-2xl bg-gradient-to-br from-[#FFFDF8] to-[#FAF5E8] border border-[#c5a059]/40 space-y-4 shadow-sm">
              {isOwned ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Badge variant="gold" className="gap-1.5 px-3.5 py-1 text-xs font-bold">
                      <Sparkles size={14} className="text-[#c5a059]" /> Purchased & Unlocked
                    </Badge>
                    <span className="text-xs font-bold text-[#15803d] bg-green-50 px-3 py-1 rounded-full border border-green-200">
                      Lifetime Access
                    </span>
                  </div>

                  <p className="text-xs text-[var(--color-text-secondary)] font-normal">
                    You own this eBook! Download your PDF copy or view your official purchase invoice below anytime.
                  </p>

                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-1">
                    <button
                      type="button"
                      onClick={async () => {
                        try {
                          setIsDownloading(true);
                          const token = user ? await user.getIdToken() : "";
                          const res = await fetch(`/api/downloads/${ebook.id}`, {
                            headers: token ? { Authorization: `Bearer ${token}` } : {},
                          });
                          if (res.ok) {
                            const data = await res.json();
                            if (data.url) {
                              window.open(data.url, "_blank");
                            }
                          }
                        } catch (err) {
                          console.error("Download error:", err);
                        } finally {
                          setIsDownloading(false);
                        }
                      }}
                      disabled={isDownloading}
                      className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-bold bg-[#c5a059] text-white hover:bg-[#b38f38] transition-all shadow-md cursor-pointer disabled:opacity-50"
                    >
                      {isDownloading ? (
                        <span className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Generating...
                        </span>
                      ) : (
                        <>
                          <Download size={16} />
                          Download eBook PDF
                        </>
                      )}
                    </button>

                    <a
                      href={`/api/invoices/${ebook.id}?uid=${user?.uid || "guest"}&format=html`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-xs font-bold border border-[#c5a059] text-[#1a1d20] bg-white hover:bg-[#FAF5E8] transition-colors shadow-xs"
                    >
                      <FileText size={15} className="text-[#c5a059]" />
                      View Invoice
                    </a>

                    <a
                      href={`/api/invoices/${ebook.id}?uid=${user?.uid || "guest"}&format=pdf`}
                      download
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-xs font-bold border border-[#c5a059] text-[#1a1d20] bg-white hover:bg-[#FAF5E8] transition-colors shadow-xs"
                    >
                      <Download size={15} className="text-[#c5a059]" />
                      Invoice PDF
                    </a>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs text-[var(--color-text-muted)] uppercase tracking-wider font-semibold block">
                        {ebook.isPayWhatYouWant
                          ? "Pay As You Want"
                          : "One-time Purchase"}
                      </span>
                      <span className="font-heading text-3xl sm:text-4xl font-bold text-[#1a1d20]">
                        {customPriceDisplay ||
                          (ebook.isPayWhatYouWant
                            ? "Custom Amount"
                            : `$${(ebook.price / 100).toFixed(2)}`)}
                      </span>
                    </div>
                    <Badge variant="gold" className="gap-1 text-xs px-3 py-1">
                      <Sparkles size={13} className="text-[#c5a059]" /> Instant PDF Download
                    </Badge>
                  </div>

                  <div id="ebook-checkout-area" className="pt-2">
                    {checkoutSlot}
                  </div>

                  <div className="pt-2 flex items-center justify-center gap-4 text-xs text-[var(--color-text-muted)] border-t border-[#c5a059]/20">
                    <span className="flex items-center gap-1">
                      <ShieldCheck size={14} className="text-[#c5a059]" /> Guaranteed Secure PayPal Checkout
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Download size={14} className="text-[#c5a059]" /> Direct PDF Link
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Fullscreen Lightbox Modal for High-Resolution Screenshot Viewing */}
      {isLightboxOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 sm:p-8"
          onClick={() => setIsLightboxOpen(false)}
        >
          <div
            className="relative max-w-4xl w-full max-h-[90vh] flex flex-col items-center justify-center space-y-3"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Controls Bar */}
            <div className="w-full flex items-center justify-between text-white pb-2 px-2 border-b border-white/10">
              <div className="flex items-center gap-2">
                <span className="font-heading text-lg font-bold text-[#c5a059]">
                  {ebook.title}
                </span>
                <span className="text-xs text-slate-300 font-sans">
                  ({currentItem.label} &bull; {selectedImageIndex + 1} of{" "}
                  {galleryItems.length})
                </span>
              </div>

              <button
                type="button"
                onClick={() => setIsLightboxOpen(false)}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                aria-label="Close fullscreen preview"
              >
                <X size={20} />
              </button>
            </div>

            {/* High-res Image Box */}
            <div className="relative w-full h-[75vh] flex items-center justify-center bg-slate-900/50 rounded-2xl overflow-hidden border border-white/10 p-2">
              <Image
                src={currentItem.url}
                alt={`${ebook.title} - ${currentItem.label}`}
                fill
                sizes="100vw"
                className="object-contain p-2"
                unoptimized
              />

              {/* Lightbox Navigation Buttons */}
              {galleryItems.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={handlePrevImage}
                    className="absolute left-3 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/60 text-white hover:bg-[#c5a059] transition-all shadow-xl border border-white/20"
                    aria-label="Previous image"
                  >
                    <ChevronLeft size={24} />
                  </button>

                  <button
                    type="button"
                    onClick={handleNextImage}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/60 text-white hover:bg-[#c5a059] transition-all shadow-xl border border-white/20"
                    aria-label="Next image"
                  >
                    <ChevronRight size={24} />
                  </button>
                </>
              )}
            </div>

            <p className="text-xs text-slate-300 text-center font-medium">
              Click anywhere outside or press X to close
            </p>
          </div>
        </div>
      )}
    </PageWrapper>
  );
}
