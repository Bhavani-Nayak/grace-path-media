"use client";

import { useState } from "react";
import PageWrapper from "@/components/layout/PageWrapper";
import GlassCard from "@/components/ui/GlassCard";
import Image from "next/image";
import {
  Heart,
  ShieldCheck,
  Sparkles,
  FileText,
  Video,
  Globe,
  Users,
  Lock,
} from "lucide-react";

const paypalBaseUrl =
  process.env.NEXT_PUBLIC_PAYPAL_SUPPORT_URL ??
  process.env.NEXT_PUBLIC_PAYPAL_ME_URL ??
  "https://www.paypal.me/bhavaninayak";

const supportTiers = [
  {
    id: "10",
    amount: "$10",
    value: 10,
    title: "Thank You!",
    description: "Every seed matters.",
    isPopular: false,
  },
  {
    id: "25",
    amount: "$25",
    value: 25,
    title: "Support Our Work",
    description: "Helps us create and share more content.",
    isPopular: false,
  },
  {
    id: "50",
    amount: "$50",
    value: 50,
    title: "Reach More Souls",
    description: "Helps us spread the message further.",
    isPopular: false,
  },
  {
    id: "100",
    amount: "$100",
    value: 100,
    title: "Make Greater Impact",
    description: "Helps us produce high-quality content and resources.",
    isPopular: true,
  },
  {
    id: "250",
    amount: "$250",
    value: 250,
    title: "Kingdom Builder",
    description: "Partner with us in changing lives.",
    isPopular: false,
  },
  {
    id: "other",
    amount: "Other",
    value: 0,
    title: "Choose Your Amount",
    description: "Enter any amount you wish to give.",
    isPopular: false,
  },
];

export default function SupportView() {
  const [selectedTier, setSelectedTier] = useState<string>("");
  const [customAmount, setCustomAmount] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Compute payment redirect URL based on selection
  const handleGiveSupport = () => {
    setErrorMsg(null);
    let finalAmount = "";

    if (selectedTier === "other") {
      const numVal = Number(customAmount);
      if (!customAmount.trim() || isNaN(numVal) || numVal <= 0) {
        setErrorMsg("Please enter a valid positive amount (e.g., $10).");
        return;
      }
      finalAmount = numVal.toString();
    } else if (selectedTier) {
      const tierObj = supportTiers.find((t) => t.id === selectedTier);
      if (tierObj && tierObj.value > 0) {
        finalAmount = tierObj.value.toString();
      }
    } else {
      setErrorMsg("Please select a support tier or enter a custom amount.");
      return;
    }

    let url = paypalBaseUrl;
    if (finalAmount && !isNaN(Number(finalAmount))) {
      // Append amount if using paypal.me link format
      const baseUrl = paypalBaseUrl.replace(/\/$/, "");
      url = `${baseUrl}/${finalAmount}`;
    }

    window.open(url, "_blank", "noopener,noreferrer");
  };


  return (
    <PageWrapper>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16 space-y-16 sm:space-y-20">
        {/* ─── Hero Section ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Column Text */}
          <div className="lg:col-span-6 space-y-6">
            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#1a1d20] leading-[1.15]">
              Your Support <br />
              <span className="text-[#c5a059]">Helps Change</span> <br />
              Eternal Lives
            </h1>

            <p className="text-[var(--color-text-secondary)] text-base sm:text-lg font-normal leading-relaxed">
              Grace Path Media is a faith-based digital platform spreading the Gospel
              through digital media. Your voluntary support helps us create Christ-centered
              content, reach more souls, and make an eternal impact worldwide.
            </p>

            {/* Feature Pills */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-white border border-[#c5a059]/25 shadow-sm">
                <ShieldCheck size={22} className="text-[#c5a059] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-[#1a1d20]">Secure & Safe</h4>
                  <p className="text-[11px] text-[var(--color-text-muted)] leading-tight">
                    Your support is secure and encrypted.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-white border border-[#c5a059]/25 shadow-sm">
                <Heart size={22} className="text-[#c5a059] shrink-0 mt-0.5 fill-[#c5a059]/20" />
                <div>
                  <h4 className="text-xs font-bold text-[#1a1d20]">100% Voluntary</h4>
                  <p className="text-[11px] text-[var(--color-text-muted)] leading-tight">
                    Give freely. No pressure. God loves a cheerful giver.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-white border border-[#c5a059]/25 shadow-sm">
                <FileText size={22} className="text-[#c5a059] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-[#1a1d20]">Transparency</h4>
                  <p className="text-[11px] text-[var(--color-text-muted)] leading-tight">
                    We are committed to honesty and accountability.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column Artwork & Scripture Quote */}
          <div className="lg:col-span-6 relative">
            <div className="relative aspect-[4/3] sm:aspect-[16/11] rounded-3xl overflow-hidden border-2 border-[#c5a059]/40 shadow-2xl bg-slate-100">
              <Image
                src="/images/jesus-hero.png"
                alt="Jesus Reaching Out Hand"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
                preload
              />

              {/* Bottom-Right Floating Quote Overlay */}
              <div className="absolute bottom-4 right-4 max-w-[240px] sm:max-w-[280px] p-4 rounded-2xl bg-white/90 backdrop-blur-md border border-[#c5a059]/40 shadow-xl text-left space-y-1 z-10">
                <p className="text-xs sm:text-sm font-serif italic text-[#1a1d20] leading-snug">
                  &ldquo;Give, and it will be given to you. A good measure, pressed down, shaken together, and running over.&rdquo;
                </p>
                <p className="text-[11px] font-bold text-[#c5a059] text-right font-sans">
                  &mdash; Luke 6:38
                </p>
              </div>

            </div>
          </div>
        </div>

        {/* ─── Choose Your Voluntary Support Grid ─── */}
        <div className="space-y-10 text-center">
          <div className="space-y-2">
            <div className="flex items-center justify-center gap-3 text-[#c5a059]">
              <span className="h-[1px] w-12 bg-[#c5a059]/40"></span>
              <Heart size={14} className="fill-[#c5a059]" />
              <span className="h-[1px] w-12 bg-[#c5a059]/40"></span>
            </div>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-[#1a1d20]">
              Support Our Mission
            </h2>
          </div>

          {/* Tiers Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {supportTiers.map((tier) => {
              const isSelected = selectedTier === tier.id;
              return (
                <div
                  key={tier.id}
                  onClick={() => setSelectedTier(tier.id)}
                  className={`relative cursor-pointer rounded-2xl p-5 text-center flex flex-col justify-between transition-all duration-300 ${
                    isSelected
                      ? "border-2 border-[#c5a059] bg-[#FAF5E8] shadow-md transform scale-[1.02]"
                      : "border border-[#c5a059]/30 bg-white hover:border-[#c5a059]/60 hover:shadow-md"
                  }`}
                >

                  {/* MOST POPULAR Badge */}
                  {tier.isPopular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#c5a059] text-white text-[9px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-sm whitespace-nowrap">
                      Most Popular
                    </div>
                  )}

                  <div className="space-y-2 pt-1">
                    <h3 className="font-heading text-2xl sm:text-3xl font-bold text-[#1a1d20]">
                      {tier.amount}
                    </h3>
                    <h4 className="text-xs font-bold text-[#1a1d20] leading-tight">
                      {tier.title}
                    </h4>
                    <p className="text-[11px] text-[var(--color-text-secondary)] leading-tight font-normal">
                      {tier.description}
                    </p>
                  </div>

                  <div className="pt-4 flex justify-center">
                    <Heart
                      size={18}
                      className={
                        isSelected
                          ? "text-[#c5a059] fill-[#c5a059]"
                          : "text-slate-300"
                      }
                    />
                  </div>
                </div>

              );
            })}
          </div>

          {/* Custom Amount Field (Shown when 'Other' selected) */}
          <div className="max-w-lg mx-auto space-y-4">
            {selectedTier === "other" && (
              <div className="flex items-center border-2 border-[#c5a059] rounded-2xl overflow-hidden bg-white shadow-sm">
                <span className="px-4 text-lg font-bold text-[#1a1d20] bg-[#FAF5E8] py-3 border-r border-[#c5a059]/30">
                  $
                </span>
                <input
                  type="number"
                  min="1"
                  step="0.01"
                  placeholder="Enter positive amount (e.g. 10.00)"
                  value={customAmount}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === "" || Number(val) >= 0) {
                      setCustomAmount(val);
                      if (errorMsg) setErrorMsg(null);
                    }
                  }}
                  className="w-full px-4 py-3 text-base text-[#1a1d20] outline-none font-medium placeholder:text-slate-400 font-sans"
                />
                <span className="px-4 text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider">
                  USD
                </span>
              </div>
            )}

            {errorMsg && (
              <p className="text-xs font-bold text-red-500 bg-red-50 border border-red-200 p-3 rounded-xl text-center">
                {errorMsg}
              </p>
            )}

            {/* Primary Action Button */}
            <button
              onClick={handleGiveSupport}
              className="w-full py-4 px-8 rounded-2xl bg-gradient-to-r from-[#c5a059] to-[#b38f38] text-white font-bold text-lg shadow-xl shadow-[#c5a059]/25 hover:shadow-2xl hover:brightness-105 active:scale-[0.99] transition-all flex items-center justify-center gap-2"
            >
              <Heart size={20} className="fill-white" />
              Support Our Mission
            </button>

            <div className="space-y-1">
              <p className="text-xs font-medium text-[var(--color-text-muted)] flex items-center justify-center gap-1.5">
                <Lock size={13} className="text-[#c5a059]" /> Secure Payment Powered by{" "}
                <span className="font-bold text-[#003087]">Pay</span>
                <span className="font-bold text-[#0079C1]">Pal</span>
              </p>
              <p className="text-[11px] text-slate-400 font-normal">
                By continuing, you agree that this is a voluntary contribution. No goods or services are provided in return.
              </p>
            </div>
          </div>
        </div>

        {/* ─── Your Support Makes a Difference ─── */}
        <div className="space-y-10 text-center">
          <div className="space-y-2">
            <div className="flex items-center justify-center gap-3 text-[#c5a059]">
              <span className="h-[1px] w-12 bg-[#c5a059]/40"></span>
              <Heart size={14} className="fill-[#c5a059]" />
              <span className="h-[1px] w-12 bg-[#c5a059]/40"></span>
            </div>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-[#1a1d20]">
              Your Support Makes a Difference
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <GlassCard className="p-6 text-center space-y-3 border border-[#c5a059]/30 bg-white shadow-md">
              <div className="h-14 w-14 rounded-2xl bg-[#FAF5E8] border border-[#c5a059]/30 flex items-center justify-center mx-auto text-[#c5a059]">
                <Video size={24} />
              </div>
              <h3 className="font-heading text-lg font-bold text-[#1a1d20]">
                Create Faith Content
              </h3>
              <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed font-normal">
                We create videos, devotionals, and resources to share God&apos;s message.
              </p>
            </GlassCard>

            <GlassCard className="p-6 text-center space-y-3 border border-[#c5a059]/30 bg-white shadow-md">
              <div className="h-14 w-14 rounded-2xl bg-[#FAF5E8] border border-[#c5a059]/30 flex items-center justify-center mx-auto text-[#c5a059]">
                <Globe size={24} />
              </div>
              <h3 className="font-heading text-lg font-bold text-[#1a1d20]">
                Reach the World
              </h3>
              <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed font-normal">
                Your support helps us reach more people across nations with the Gospel.
              </p>
            </GlassCard>

            <GlassCard className="p-6 text-center space-y-3 border border-[#c5a059]/30 bg-white shadow-md">
              <div className="h-14 w-14 rounded-2xl bg-[#FAF5E8] border border-[#c5a059]/30 flex items-center justify-center mx-auto text-[#c5a059]">
                <Users size={24} />
              </div>
              <h3 className="font-heading text-lg font-bold text-[#1a1d20]">
                Strengthen Believers
              </h3>
              <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed font-normal">
                We encourage and equip believers to grow in faith and walk in God&apos;s purpose.
              </p>
            </GlassCard>

            <GlassCard className="p-6 text-center space-y-3 border border-[#c5a059]/30 bg-white shadow-md">
              <div className="h-14 w-14 rounded-2xl bg-[#FAF5E8] border border-[#c5a059]/30 flex items-center justify-center mx-auto text-[#c5a059]">
                <Heart size={24} className="fill-[#c5a059]/20" />
              </div>
              <h3 className="font-heading text-lg font-bold text-[#1a1d20]">
                Serve in Love
              </h3>
              <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed font-normal">
                We support faith initiatives and outreach to bring hope to those in need.
              </p>
            </GlassCard>
          </div>
        </div>

        {/* ─── Important Notice & Thank You Banner ─── */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#FFFDF8] to-[#FAF5E8] border border-[#c5a059]/40 shadow-sm items-center">
          <div className="md:col-span-8 flex items-start gap-4">
            <div className="h-10 w-10 rounded-xl bg-white border border-[#c5a059]/40 flex items-center justify-center text-[#c5a059] shrink-0 mt-0.5">
              <ShieldCheck size={20} />
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-[#1a1d20]">Important Notice</h4>
              <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed font-normal">
                Grace Path Media is a faith-based digital platform. Your support is completely voluntary
                and is used to further our mission of sharing Christ-centered digital resources globally.
              </p>
            </div>
          </div>

          <div className="md:col-span-4 text-center md:text-right border-t md:border-t-0 md:border-l border-[#c5a059]/20 pt-4 md:pt-0 md:pl-6">
            <h4 className="font-heading text-lg font-bold text-[#1a1d20]">
              Grace Path Media <span className="text-[#c5a059]">♡</span>
            </h4>
            <p className="text-xs text-[var(--color-text-muted)] italic font-serif">
              Thank you for being a part of our mission!
            </p>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
