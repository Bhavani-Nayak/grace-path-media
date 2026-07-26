"use client";

import PageWrapper from "@/components/layout/PageWrapper";
import GlassCard from "@/components/ui/GlassCard";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import {
  BookOpen,
  Target,
  Layers,
  ShieldCheck,
  Eye,
  HeartHandshake,
  Mail,
  Globe,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

const MISSION_POINTS = [
  "Publish Scripture-centered digital resources that encourage faith and spiritual growth.",
  "Create biblical content that helps readers understand and apply God's Word.",
  "Inspire believers to grow in prayer, wisdom, and their daily walk with Jesus Christ.",
  "Make trustworthy Christian teaching accessible through modern digital platforms.",
  "Reach people around the world with hope, encouragement, and biblical truth.",
];

const WHAT_WE_CREATE = [
  { title: "Christian eBooks", desc: "Short, honest, and biblically rooted reads." },
  { title: "Bible Study & Devotionals", desc: "Daily reflections crafted for quiet mornings." },
  { title: "Teaching Materials", desc: "Scripture-based study guides and educational content." },
  { title: "Inspirational Articles", desc: "Weekly blog posts and practical encouragement." },
  { title: "Faith Educational Content", desc: "Deepening biblical understanding and daily application." },
  { title: "Digital Publications", desc: "Accessible publishing designed to strengthen believers." },
];

const CORE_VALUES = [
  "Faithfulness to Scripture",
  "Integrity and honesty",
  "Excellence in digital publishing",
  "Compassion and encouragement",
  "Biblical truth with clarity",
  "Serving others with humility and grace",
];

export default function AboutView() {
  return (
    <PageWrapper>
      <div className="max-w-5xl mx-auto px-6 py-20 space-y-16">
        {/* ─── Hero / Introduction ─── */}
        <div className="space-y-6">
          <Badge variant="gold" className="gap-1.5">
            <Sparkles size={14} className="text-[#c5a059]" />
            About Grace Path Media
          </Badge>
          
          <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl font-bold text-[#1a1d20] tracking-tight leading-tight">
            Welcome to Grace Path Media
          </h1>

          <p className="text-xl font-heading text-[#c5a059] font-bold tracking-wide">
            Inspiring Faith. Impacting Lives.
          </p>

          <div className="space-y-5 text-[var(--color-text-secondary)] leading-relaxed text-base sm:text-lg font-normal">
            <p>
              Grace Path Media is a Christian digital publishing and media platform dedicated to creating Scripture-centered resources that encourage faith, strengthen biblical understanding, and inspire people to grow in their relationship with Jesus Christ.
            </p>
            <p>
              Our mission is to communicate timeless biblical truth through high-quality digital content that is accessible to people around the world. Through eBooks, devotionals, Bible-based teaching resources, inspirational articles, and other faith-centered publications, we seek to equip believers with practical encouragement firmly rooted in God&apos;s Word.
            </p>
            <p>
              We believe digital technology provides an extraordinary opportunity to share the message of Christ beyond geographical boundaries. By combining biblical teaching with professional digital publishing, we strive to create resources that encourage spiritual growth, deepen faith, and help people apply Scripture to everyday life.
            </p>
          </div>
        </div>

        {/* ─── Our Mission ─── */}
        <GlassCard className="p-8 sm:p-10 border border-[#c5a059]/30 bg-white shadow-lg space-y-6">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-2xl bg-[#c5a059]/15 border border-[#c5a059]/35 flex items-center justify-center shrink-0">
              <Target size={24} className="text-[#c5a059]" />
            </div>
            <div>
              <h2 className="font-heading text-2xl sm:text-3xl font-bold text-[#1a1d20]">
                Our Mission
              </h2>
              <p className="text-xs text-[var(--color-text-muted)]">
                Guided by Scripture & Purpose
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            {MISSION_POINTS.map((point) => (
              <div key={point} className="flex items-start gap-3 p-3 rounded-xl bg-[#fafaf7] border border-black/5">
                <CheckCircle2 size={18} className="text-[#c5a059] mt-0.5 shrink-0" />
                <span className="text-sm text-[var(--color-text-secondary)] font-normal">
                  {point}
                </span>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* ─── What We Create ─── */}
        <div className="space-y-8">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-[#c5a059] uppercase tracking-wider">
              <Layers size={16} />
              <span>Digital Publications</span>
            </div>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-[#1a1d20]">
              What We Create
            </h2>
            <p className="text-sm text-[var(--color-text-secondary)] font-normal">
              Grace Path Media publishes a growing collection of faith-based digital resources.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {WHAT_WE_CREATE.map((item) => (
              <GlassCard key={item.title} className="p-6 border border-[#c5a059]/30 bg-white shadow-md hover-gold-glow">
                <div className="h-10 w-10 rounded-xl bg-[#c5a059]/15 border border-[#c5a059]/30 flex items-center justify-center mb-4">
                  <BookOpen size={20} className="text-[#c5a059]" />
                </div>
                <h3 className="font-heading text-lg font-bold text-[#1a1d20] mb-1">
                  {item.title}
                </h3>
                <p className="text-xs text-[var(--color-text-secondary)] font-normal">
                  {item.desc}
                </p>
              </GlassCard>
            ))}
          </div>
        </div>

        {/* ─── Our Core Values ─── */}
        <div className="space-y-6">
          <div className="flex items-center gap-2 text-xs font-bold text-[#c5a059] uppercase tracking-wider">
            <ShieldCheck size={16} />
            <span>Guiding Principles</span>
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-[#1a1d20]">
            Our Core Values
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {CORE_VALUES.map((val) => (
              <div
                key={val}
                className="p-4 rounded-2xl bg-white border border-[#c5a059]/30 shadow-sm flex items-center gap-3"
              >
                <div className="h-2 w-2 rounded-full bg-[#c5a059]" />
                <span className="text-sm font-semibold text-[#1a1d20]">
                  {val}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ─── Our Vision Banner ─── */}
        <GlassCard className="p-8 sm:p-12 border border-[#c5a059]/40 bg-gradient-to-r from-[#FAF5E8] via-[#FFFDF8] to-[#F5EFE0] shadow-xl space-y-4">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-2xl bg-[#c5a059]/20 border border-[#c5a059]/40 flex items-center justify-center shrink-0">
              <Eye size={24} className="text-[#c5a059]" />
            </div>
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-[#1a1d20]">
              Our Vision
            </h2>
          </div>
          <p className="text-base text-[var(--color-text-secondary)] leading-relaxed font-normal">
            We envision a world where trustworthy Christian digital resources are available to anyone seeking biblical wisdom, spiritual encouragement, and a deeper understanding of God&apos;s Word.
          </p>
          <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed font-normal">
            As technology continues to connect people across cultures and nations, we remain committed to publishing resources that inspire faith, strengthen believers, and help people confidently live according to biblical principles.
          </p>
        </GlassCard>

        {/* ─── Support Our Work & Connect ─── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <GlassCard className="p-8 border border-[#c5a059]/30 bg-white shadow-md flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-[#c5a059] uppercase tracking-wider">
                <HeartHandshake size={16} />
                <span>Support Our Work</span>
              </div>
              <h3 className="font-heading text-2xl font-bold text-[#1a1d20]">
                Help Us Continue Creating
              </h3>
              <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed font-normal">
                If Grace Path Media has encouraged or strengthened your faith, your voluntary support enables us to continue creating Scripture-centered digital resources for readers around the world.
              </p>
              <p className="text-xs text-[var(--color-text-muted)] leading-relaxed">
                Every purchase and voluntary contribution helps support research, writing, editing, digital publishing, website development, content production, and biblically grounded resources.
              </p>
            </div>
            <Button href="/support" variant="gold" size="md" className="w-full">
              Support Our Mission
            </Button>
          </GlassCard>

          <GlassCard className="p-8 border border-[#c5a059]/30 bg-white shadow-md flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-[#c5a059] uppercase tracking-wider">
                <Mail size={16} />
                <span>Connect With Us</span>
              </div>
              <h3 className="font-heading text-2xl font-bold text-[#1a1d20]">
                We&apos;d Love to Hear From You
              </h3>
              <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed font-normal">
                We value every message we receive and welcome your questions, feedback, testimonies, and words of encouragement.
              </p>
              <div className="space-y-1 text-xs text-[#1a1d20] pt-2">
                <p className="flex items-center gap-2 font-medium">
                  <Globe size={14} className="text-[#c5a059]" />
                  <span>gracepathmedia.com</span>
                </p>
                <p className="flex items-center gap-2 font-medium">
                  <Mail size={14} className="text-[#c5a059]" />
                  <a href="mailto:contact@gracepathmedia.com" className="hover:underline text-[#c5a059]">
                    contact@gracepathmedia.com
                  </a>
                </p>
              </div>
            </div>
            <Button href="/contact" variant="gold-outline" size="md" className="w-full">
              Contact Our Team
            </Button>
          </GlassCard>
        </div>

        {/* Closing Prayer Blessing */}
        <div className="text-center pt-8 max-w-2xl mx-auto space-y-3">
          <p className="font-heading text-xl italic text-[#1a1d20]">
            &ldquo;Our prayer is that every resource we publish encourages your faith, deepens your understanding of God&apos;s Word, and helps you walk each day with hope, wisdom, and confidence in Jesus Christ.&rdquo;
          </p>
          <p className="text-xs font-bold uppercase tracking-widest text-[#c5a059]">
            Grace Path Media — Inspiring Faith. Impacting Lives.
          </p>
        </div>
      </div>
    </PageWrapper>
  );
}



