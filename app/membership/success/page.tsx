"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import PageWrapper from "@/components/layout/PageWrapper";
import GlassCard from "@/components/ui/GlassCard";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { CheckCircle, Sparkles, Mail, ArrowRight } from "lucide-react";
import Link from "next/link";

function SuccessContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  return (
    <PageWrapper>
      <div className="max-w-2xl mx-auto px-6 py-20 space-y-10">
        {/* Success animation */}
        <div className="text-center space-y-6">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-[#c5a059]/20 to-[#c5a059]/40 border-2 border-[#c5a059]/50 shadow-lg animate-bounce-slow">
            <CheckCircle size={48} className="text-[#c5a059]" />
          </div>

          <Badge variant="gold" className="gap-1.5">
            <Sparkles size={14} className="text-[#c5a059]" />
            Membership Activated
          </Badge>

          <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-[#1a1d20] tracking-tight leading-tight">
            Welcome to Grace Path 🙏
          </h1>

          <p className="text-[var(--color-text-secondary)] text-lg leading-relaxed max-w-lg mx-auto">
            Your membership has been successfully activated. You are now part of the
            Daily Walk With God devotional community.
          </p>
        </div>

        {/* Confirmation card */}
        <GlassCard className="p-8 sm:p-10 border border-[#c5a059]/40 bg-gradient-to-b from-[#FFFDF8] to-[#FAF5E8] shadow-xl space-y-6">
          <h2 className="font-heading text-xl font-bold text-[#1a1d20]">
            What happens next?
          </h2>

          <ul className="space-y-4">
            {[
              {
                icon: Mail,
                title: "Check your email",
                desc: "A confirmation and your first devotional message will arrive in your inbox shortly.",
              },
              {
                icon: Sparkles,
                title: "Daily messages begin",
                desc: "Every morning you'll receive a personal message of peace, guidance, and spiritual clarity.",
              },
              {
                icon: ArrowRight,
                title: "Full archive access",
                desc: "Browse all past devotional readings and audio experiences anytime from your account.",
              },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.title} className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-xl bg-[#c5a059]/15 border border-[#c5a059]/35 flex items-center justify-center shrink-0 mt-0.5">
                    <Icon size={20} className="text-[#c5a059]" />
                  </div>
                  <div>
                    <p className="font-bold text-sm text-[#1a1d20]">{item.title}</p>
                    <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>

          {token && (
            <div className="pt-4 border-t border-[#c5a059]/20">
              <p className="text-[11px] text-[var(--color-text-muted)] font-mono">
                Order reference: {token}
              </p>
            </div>
          )}
        </GlassCard>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/">
            <Button variant="gold" size="lg" className="w-full sm:w-auto px-8 py-4 gap-2">
              <ArrowRight size={18} />
              Go to Home
            </Button>
          </Link>
          <Link href="/ebooks">
            <Button variant="gold-outline" size="lg" className="w-full sm:w-auto px-8 py-4">
              Browse eBooks
            </Button>
          </Link>
        </div>

        <p className="text-center text-xs text-[var(--color-text-muted)] font-medium">
          Grace Path Media — Daily Walk With God. Your membership is managed securely via PayPal.
        </p>
      </div>

      <style jsx>{`
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }
      `}</style>
    </PageWrapper>
  );
}

export default function MembershipSuccessPage() {
  return (
    <Suspense
      fallback={
        <PageWrapper>
          <div className="flex items-center justify-center min-h-[60vh]">
            <p className="text-[var(--color-text-secondary)]">Loading...</p>
          </div>
        </PageWrapper>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
