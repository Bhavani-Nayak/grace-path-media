"use client";

import { useState } from "react";
import PageWrapper from "@/components/layout/PageWrapper";
import GlassCard from "@/components/ui/GlassCard";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import ErrorMessage from "@/components/ui/ErrorMessage";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  CheckSquare,
  Zap,
  Lock,
  Shield,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  X,
  Tablet,
  Laptop,
  BookOpen,
  Smartphone,
  Printer,
  Download,
  FileText,
  Sparkles,
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
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-14 space-y-8">
        <Link
          href="/ebooks"
          className="inline-flex items-center gap-2 text-xs font-bold text-[#c5a059] uppercase tracking-wider hover:underline"
        >
          <ArrowLeft size={14} /> Back to Ebooks Catalog
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Interactive Main Image Display + Thumbnails + Works On Section */}
          <div className="lg:col-span-5 space-y-5 flex flex-col items-center">
            {/* Main Cover / Screenshot Card */}
            <div className="p-4 border border-black/10 bg-white shadow-xl rounded-2xl w-full max-w-md relative group">
              <div
                onClick={() => setIsLightboxOpen(true)}
                className="relative aspect-[3/4] w-full rounded-xl overflow-hidden bg-slate-50 border border-black/5 shadow-inner cursor-pointer"
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
            </div>

            {/* Thumbnail Strip */}
            {galleryItems.length > 1 && (
              <div className="w-full max-w-md space-y-2">
                <div className="flex items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={handlePrevImage}
                    className="p-1.5 rounded-full border border-slate-300 bg-white text-slate-700 hover:bg-[#c5a059] hover:text-white transition-all shadow-xs shrink-0 cursor-pointer"
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
                          className={`relative h-20 w-16 rounded-lg overflow-hidden border-2 transition-all shrink-0 bg-slate-100 shadow-xs cursor-pointer ${
                            isSelected
                              ? "border-[#3b82f6] ring-2 ring-[#3b82f6]/30 scale-105"
                              : "border-slate-200 opacity-70 hover:opacity-100 hover:border-slate-400"
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
                        </button>
                      );
                    })}
                  </div>

                  <button
                    type="button"
                    onClick={handleNextImage}
                    className="p-1.5 rounded-full border border-slate-300 bg-white text-slate-700 hover:bg-[#c5a059] hover:text-white transition-all shadow-xs shrink-0 cursor-pointer"
                    aria-label="Next sample image"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}

            {/* Works On Device Bar (Matches User Screenshot) */}
            <div className="w-full max-w-md bg-[#fafaf8] border border-slate-200/80 rounded-xl p-4 space-y-2 text-center shadow-xs">
              <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-slate-700 uppercase tracking-wider">
                <BookOpen size={14} className="text-slate-600" />
                <span>Works On</span>
              </div>
              <div className="flex items-center justify-center gap-4 text-slate-500 pt-1">
                <div className="flex flex-col items-center gap-1" title="Tablet">
                  <Tablet size={22} className="text-purple-600" />
                </div>
                <div className="flex flex-col items-center gap-1" title="Laptop">
                  <Laptop size={22} className="text-sky-500" />
                </div>
                <div className="flex flex-col items-center gap-1" title="e-Reader / Book">
                  <BookOpen size={22} className="text-blue-500" />
                </div>
                <div className="flex flex-col items-center gap-1" title="Smartphone">
                  <Smartphone size={22} className="text-indigo-500" />
                </div>
                <div className="flex flex-col items-center gap-1" title="Printable">
                  <Printer size={22} className="text-purple-500" />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Ebook Details & Checkout (Identical to User Reference Image) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Top Pill Badges (Digital Download, Worldwide Access) */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#2563eb] text-white shadow-xs">
                Digital Download
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#0284c7] text-white shadow-xs">
                Worldwide Access
              </span>
            </div>

            {/* Title */}
            <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 tracking-tight leading-tight">
              {ebook.title}
            </h1>

            {/* Price Display */}
            <div className="font-heading text-3xl font-bold text-emerald-700">
              {customPriceDisplay ||
                (ebook.isPayWhatYouWant
                  ? "Pay As You Want"
                  : `$${(ebook.price / 100).toFixed(2)}`)}
            </div>

            {/* Description */}
            <p className="text-slate-600 leading-relaxed text-base font-normal">
              {ebook.description}
            </p>

            <hr className="border-slate-200" />

            {/* What's Included Section */}
            <div className="space-y-3">
              <h3 className="font-heading text-lg font-bold text-slate-900">
                What&apos;s Included
              </h3>
              <ul className="space-y-2.5 text-sm font-medium text-slate-700">
                <li className="flex items-center gap-2.5">
                  <span className="p-0.5 rounded bg-emerald-500 text-white shrink-0">
                    <CheckSquare size={16} />
                  </span>
                  <span>Instant PDF Download</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="p-0.5 rounded bg-emerald-500 text-white shrink-0">
                    <CheckSquare size={16} />
                  </span>
                  <span>Over {ebook.pageCount} Pages</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="p-0.5 rounded bg-emerald-500 text-white shrink-0">
                    <CheckSquare size={16} />
                  </span>
                  <span>Lifetime Access</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="p-0.5 rounded bg-emerald-500 text-white shrink-0">
                    <CheckSquare size={16} />
                  </span>
                  <span>Mobile & Tablet Friendly</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="p-0.5 rounded bg-emerald-500 text-white shrink-0">
                    <CheckSquare size={16} />
                  </span>
                  <span>Printable Version Included</span>
                </li>
              </ul>
            </div>

            <hr className="border-slate-200" />

            {/* Instant Download Banner (⚡ Lightning Box) */}
            <div className="flex items-start gap-3 p-4 rounded-xl bg-orange-50/60 border border-orange-100 text-slate-800">
              <div className="p-2 rounded-lg bg-orange-500 text-white shrink-0 mt-0.5 shadow-xs">
                <Zap size={18} />
              </div>
              <div className="space-y-0.5">
                <h4 className="font-bold text-sm text-slate-900">
                  Instant Download
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Access your eBook immediately after successful payment.
                </p>
              </div>
            </div>

            {/* Checkout & Purchase Box */}
            <div className="space-y-5">
              {isOwned ? (
                <div className="p-6 rounded-2xl bg-emerald-50/80 border border-emerald-200 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-600 text-white flex items-center gap-1.5">
                      <Sparkles size={14} /> Purchased & Unlocked
                    </span>
                    <span className="text-xs font-bold text-emerald-800">
                      Lifetime Access ✓
                    </span>
                  </div>
                  <p className="text-xs text-slate-700">
                    You own this eBook! Download your copy below or access your purchase invoice anytime.
                  </p>
                  <div className="flex flex-wrap items-center gap-3">
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
                      className="px-5 py-3 rounded-xl text-sm font-bold bg-emerald-600 hover:bg-emerald-700 text-white transition-all shadow-md cursor-pointer disabled:opacity-50 inline-flex items-center gap-2"
                    >
                      {isDownloading ? (
                        <span>Downloading...</span>
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
                      className="px-4 py-3 rounded-xl text-xs font-bold border border-slate-300 text-slate-800 bg-white hover:bg-slate-50 transition-colors inline-flex items-center gap-2 shadow-xs"
                    >
                      <FileText size={15} />
                      View Invoice
                    </a>
                  </div>
                </div>
              ) : (
                <div id="ebook-checkout-area" className="space-y-4">
                  {checkoutSlot}
                </div>
              )}
            </div>

            {/* Secure Checkout Card */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/90 text-center space-y-3 shadow-xs">
              <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-slate-800">
                <Lock size={15} className="text-amber-600" />
                <span>Secure Checkout</span>
              </div>

              {/* Payment Pill Badges */}
              <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                <span className="px-3 py-1 rounded-lg bg-[#0070ba] text-white text-xs font-bold shadow-xs">
                  PayPal
                </span>
                <span className="px-3 py-1 rounded-lg bg-[#1a1f71] text-white text-xs font-bold shadow-xs">
                  Visa
                </span>
                <span className="px-3 py-1 rounded-lg bg-[#eb001b] text-white text-xs font-bold shadow-xs">
                  Mastercard
                </span>
                <span className="px-3 py-1 rounded-lg bg-emerald-700 text-white text-xs font-bold shadow-xs">
                  SSL Secured
                </span>
              </div>

              <p className="text-[11px] text-slate-500 font-normal leading-relaxed max-w-sm mx-auto">
                Your payment information is securely processed using industry-standard encryption.
              </p>
            </div>

            {/* 30-Day Money-Back Guarantee Banner */}
            <div className="p-4 sm:p-5 rounded-2xl bg-[#dcfce7]/70 border border-emerald-200 flex items-start gap-4 shadow-xs">
              <div className="p-2.5 rounded-xl bg-blue-500 text-white shrink-0 mt-0.5 shadow-sm">
                <Shield size={22} />
              </div>
              <div className="space-y-1">
                <h4 className="font-heading text-base sm:text-lg font-bold text-slate-900">
                  30-Day Money-Back Guarantee
                </h4>
                <p className="text-xs sm:text-sm text-slate-700 font-normal leading-relaxed">
                  If you&apos;re not completely satisfied, simply contact us within 30 days for a full refund.
                </p>
              </div>
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
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
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
                    className="absolute left-3 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/60 text-white hover:bg-[#c5a059] transition-all shadow-xl border border-white/20 cursor-pointer"
                    aria-label="Previous image"
                  >
                    <ChevronLeft size={24} />
                  </button>

                  <button
                    type="button"
                    onClick={handleNextImage}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/60 text-white hover:bg-[#c5a059] transition-all shadow-xl border border-white/20 cursor-pointer"
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
