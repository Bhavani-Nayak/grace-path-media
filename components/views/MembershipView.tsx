"use client";

import { useState, useRef } from "react";
import PageWrapper from "@/components/layout/PageWrapper";
import GlassCard from "@/components/ui/GlassCard";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { Check, Sun, BookOpen, Headphones, Sparkles, ChevronDown, ShieldCheck } from "lucide-react";
import type { MembershipPlan } from "@/viewmodels/useMembershipViewModel";
import PayPalCheckoutButton from "@/components/paypal/PayPalCheckoutButton";

interface MembershipViewProps {
  plans: MembershipPlan[];
  isLoading: boolean;
  error: string | null;
  subscribe: (plan: MembershipPlan) => void;
}

export default function MembershipView({
  plans,
  isLoading,
  error,
  subscribe,
}: MembershipViewProps) {
  const [showPrices, setShowPrices] = useState(false);
  const pricingRef = useRef<HTMLDivElement>(null);

  const handleRevealPrices = () => {
    setShowPrices(true);
    setTimeout(() => {
      pricingRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 50);
  };

  return (
    <PageWrapper>
      <div className="max-w-5xl mx-auto px-6 py-20 space-y-16">
        {/* ─── Hero Section ─── */}
        <div className="text-center space-y-8 max-w-4xl mx-auto">
          <div className="space-y-4 max-w-3xl mx-auto">
            <Badge variant="gold" className="gap-1.5">
              <Sparkles size={14} className="text-[#c5a059]" />
              Daily Walk With God
            </Badge>

            <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl font-bold text-[#1a1d20] tracking-tight leading-tight">
              Receive A Personal Message From God Every Morning 🙏
            </h1>

            <p className="text-[var(--color-text-secondary)] text-lg sm:text-xl font-normal leading-relaxed">
              Start your day with peace, guidance, and spiritual clarity through powerful daily devotional messages prepared to strengthen your walk with God.
            </p>
          </div>

          {/* ─── YouTube Video Section (Above Join NOW! Button) ─── */}
          <div className="space-y-3">
            <div className="rounded-3xl overflow-hidden shadow-2xl border-2 border-[#c5a059]/40 bg-black aspect-video relative group">
              <iframe
                className="w-full h-full rounded-3xl"
                src="https://www.youtube.com/embed/jbVD41XvvoU?autoplay=0&rel=0"
                title="Daily Walk With God Devotional Experience"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <p className="text-center text-xs font-medium text-[var(--color-text-muted)]">
              ▶ Watch: Experience a quiet morning preview of the &quot;Daily Walk With God&quot; devotional program.
            </p>
          </div>

          {/* ─── Join NOW Button (Below Video) ─── */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              onClick={handleRevealPrices}
              variant="gold"
              size="lg"
              className="w-full sm:w-auto shadow-lg text-base py-4 px-8"
            >
              <span>Join NOW! View Membership Plans</span>
              <ChevronDown size={18} />
            </Button>
          </div>
        </div>



        {/* ─── Program Highlights ─── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: Sun,
              title: "Morning Guidance",
              desc: "Delivered straight to your email every morning to start your day anchored in God's peace.",
            },
            {
              icon: BookOpen,
              title: "Biblical Reflection",
              desc: "Short, honest, and practical reflections built for quiet mornings and personal prayer.",
            },
            {
              icon: Headphones,
              title: "Full Digital Archive",
              desc: "Unlimited access to all past reading & audio devotional experiences whenever you return.",
            },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <GlassCard
                key={item.title}
                className="p-8 border border-[#c5a059]/30 bg-white shadow-md hover-gold-glow space-y-4"
              >
                <div className="h-12 w-12 rounded-2xl bg-[#c5a059]/15 border border-[#c5a059]/35 flex items-center justify-center shrink-0">
                  <Icon size={24} className="text-[#c5a059]" />
                </div>
                <h3 className="font-heading text-xl font-bold text-[#1a1d20]">
                  {item.title}
                </h3>
                <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed font-normal">
                  {item.desc}
                </p>
              </GlassCard>
            );
          })}
        </div>

        {/* ─── Guarantee / Trust Banner ─── */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-[#FAF5E8] via-[#FFFDF8] to-[#F5EFE0] border border-[#c5a059]/40 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <ShieldCheck size={28} className="text-[#c5a059] shrink-0" />
            <div>
              <p className="text-sm font-bold text-[#1a1d20]">
                Cancel Anytime Easily
              </p>
              <p className="text-xs text-[var(--color-text-secondary)] font-normal">
                No contracts or commitment. Managed securely through PayPal.
              </p>
            </div>
          </div>
          <Button
            onClick={handleRevealPrices}
            variant="gold-outline"
            size="sm"
            className="shrink-0"
          >
            View Pricing Options
          </Button>
        </div>

        {/* ─── Choose Your Journey / Pricing Section ─── */}
        <div ref={pricingRef} id="pricing-plans" className="space-y-8 scroll-mt-24">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <Badge variant="gold">Membership Plans</Badge>
            <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-[#1a1d20]">
              Choose Your Journey 🙏
            </h2>
            <p className="text-base text-[var(--color-text-secondary)] font-normal">
              Select your preferred membership tier below to receive daily devotional messages and full archive access.
            </p>
          </div>

          {error && (
            <p className="text-center text-red-600 mb-8 font-medium">{error}</p>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {plans.map((plan) => (
              <GlassCard
                key={plan.id}
                className={`p-8 sm:p-10 flex flex-col justify-between border hover-gold-glow bg-white shadow-xl transition-all ${
                  plan.popular
                    ? "border-[#c5a059] bg-gradient-to-b from-[#FFFDF8] to-[#FAF5E8] ring-2 ring-[#c5a059]/30"
                    : "border-[#c5a059]/40"
                }`}
              >
                <div className="space-y-6">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-heading text-2xl sm:text-3xl font-bold text-[#1a1d20]">
                      {plan.name}
                    </h3>
                    {plan.popular && (
                      <Badge variant="gold">
                        Most Popular Choice
                      </Badge>
                    )}
                  </div>

                  <p className="text-xs text-[var(--color-text-secondary)] font-normal">
                    {plan.description}
                  </p>

                  <div className="flex items-baseline gap-1 py-2 border-y border-black/5">
                    <span className="font-heading text-5xl sm:text-6xl font-bold text-[#1a1d20]">
                      {plan.price}
                    </span>
                    <span className="text-base text-[var(--color-text-muted)] font-normal">
                      {plan.period}
                    </span>
                  </div>

                  <ul className="space-y-3.5">
                    {plan.features.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-start gap-3 text-sm text-[#1a1d20] font-medium"
                      >
                        <Check
                          size={18}
                          className="text-[#c5a059] mt-0.5 shrink-0"
                        />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-8">
                  <PayPalCheckoutButton
                    productId={plan.id}
                    productSlug="membership"
                    amount={plan.amountCents}
                    successRedirect="/membership/success"
                  />
                </div>
              </GlassCard>
            ))}
          </div>
        </div>

        {/* Footer encouragement */}
        <div className="text-center pt-8 text-xs font-medium text-[var(--color-text-muted)]">
          <p>
            Grace Path Media — Daily Walk With God Program. All subscriptions are processed securely via PayPal.
          </p>
        </div>
      </div>
    </PageWrapper>
  );
}



