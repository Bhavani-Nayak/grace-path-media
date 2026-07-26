"use client";

import PageWrapper from "@/components/layout/PageWrapper";
import GlassCard from "@/components/ui/GlassCard";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { Download, CheckCircle, Sparkles, FileText } from "lucide-react";

interface ThankYouViewProps {
  isLoading: boolean;
  isPaid: boolean;
  downloadUrl: string | null;
  ebookTitle?: string | null;
  error: string | null;
}

export default function ThankYouView({
  isLoading,
  isPaid,
  downloadUrl,
  ebookTitle,
  error,
}: ThankYouViewProps) {
  return (
    <PageWrapper>
      <div className="max-w-xl mx-auto px-6 py-24 text-center">
        {isLoading && <LoadingSpinner className="py-12" />}

        {!isLoading && isPaid && (
          <GlassCard className="p-8 sm:p-12 border border-[#c5a059]/40 bg-white shadow-2xl space-y-6">
            <div className="h-20 w-20 rounded-2xl bg-[#c5a059]/15 border border-[#c5a059]/40 flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle
                size={36}
                className="text-[#c5a059]"
              />
            </div>
            <div className="space-y-2">
              <Badge variant="gold" className="gap-1.5">
                <Sparkles size={13} className="text-[#c5a059]" />
                Payment Confirmed
              </Badge>
              <h1 className="font-heading text-3xl sm:text-4xl font-bold text-[#1a1d20] tracking-tight">
                Thank You for Your Support!
              </h1>
              {ebookTitle && (
                <p className="font-heading text-lg font-semibold text-[#c5a059]">
                  {ebookTitle}
                </p>
              )}
            </div>

            <p className="text-[var(--color-text-secondary)] text-sm sm:text-base font-normal leading-relaxed">
              Your payment has been successfully confirmed. Your digital PDF ebook is ready for instant download below.
            </p>

            {downloadUrl && (
              <a
                href={downloadUrl}
                download
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2.5 w-full px-6 py-4 rounded-xl text-base font-bold bg-[#c5a059] text-white hover:bg-[#b38f38] shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
              >
                <Download size={20} />
                Download Ebook PDF
              </a>
            )}

            {/* Lifetime Printable & PDF Invoice Links */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <a
                href="/account/downloads"
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold border border-[#c5a059]/60 text-[#1a1d20] bg-white hover:bg-[#FAF5E8] transition-colors shadow-xs w-full sm:w-auto"
              >
                <FileText size={15} className="text-[#c5a059]" />
                View Lifetime Invoice & Library
              </a>
            </div>

            <div className="pt-4 border-t border-black/5 flex items-center justify-center gap-4">
              <Button href="/ebooks" variant="gold-outline" size="sm">
                ← Back to Catalog
              </Button>
            </div>
          </GlassCard>
        )}

        {!isLoading && !isPaid && (
          <GlassCard className="p-8 sm:p-12 border border-[#c5a059]/30 bg-white shadow-xl space-y-6">
            <h1 className="font-heading text-3xl font-bold text-[#1a1d20]">
              Order Not Found
            </h1>
            <p className="text-[var(--color-text-secondary)] text-sm font-normal leading-relaxed">
              {error ?? "We couldn't verify your payment. If you believe this is an error, please reach out to support."}
            </p>
            <Button href="/contact" variant="gold">
              Contact Support
            </Button>
          </GlassCard>
        )}
      </div>
    </PageWrapper>
  );
}


