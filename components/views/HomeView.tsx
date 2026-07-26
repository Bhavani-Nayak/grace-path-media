"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  Sunrise,
  Feather,
  Play,
  X,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  HeartHandshake,
  ArrowRight,
  CheckCircle2,
  Users,
  Clock,
  Globe2,
} from "lucide-react";
import Image from "next/image";
import BlurText from "@/components/ui/BlurText";
import GlassCard from "@/components/ui/GlassCard";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const HERO_SLIDES = [
  {
    id: 1,
    badge: "Featured Message",
    title: "I Need To Talk To You",
    subtitle: "This message is for you. You are not here by accident.",
    image:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1920&q=90",
    ctaText: 'Join "Daily Walk With God" Program',
    ctaLink: "/membership",
    videoId: "jbVD41XvvoU",
  },
  {
    id: 2,
    badge: "Daily Reflections",
    title: "Finding Peace in the Storm",
    subtitle: "Digital media and readings crafted for slow mornings and quiet strength.",
    image:
      "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1920&q=90",
    ctaText: "Explore Ebook Catalog",
    ctaLink: "/ebooks",
    videoId: "jbVD41XvvoU",
  },
  {
    id: 3,
    badge: "Faith Community",
    title: "Support Our Mission",
    subtitle: "Support our mission and digital publications to help spread hope & grace across the globe.",
    image:
      "https://images.unsplash.com/photo-1470240731273-7821a6eeb6bd?auto=format&fit=crop&w=1920&q=90",
    ctaText: "Support Our Mission",
    ctaLink: "/support",
    videoId: "jbVD41XvvoU",
  },
];

const PRODUCTS = [
  {
    type: "Ebook",
    title: '"Letters of Grace" Ebook',
    price: "$24.97",
    tags: ["Best Seller", "Instant PDF Download"],
    description:
      "Thirty-one heartfelt, scripture-filled letters offering hope, encouragement, and honest reflection for every season of walking with God.",
    image: "/images/Letters_of_Grace_Final.png",
    link: "/ebooks/letters-of-grace",
  },
  {
    type: "Membership",
    title: '"Daily Walk With God" Program',
    price: "$4.99/mo",
    tags: ["Daily Email", "Full Audio Archive"],
    description:
      "One quiet morning reading delivered straight to your inbox each morning, plus full access to past archives.",
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80",
    link: "/membership",
  },
  {
    type: "Ebook",
    title: '"The Power of the Seed" Ebook',
    price: "Pay What You Want",
    tags: ["Faith Seed", "Digital Media"],
    description:
      "Discover the profound biblical principles of spiritual planting, faith, and patience. Download instantly on any device.",
    image: "/images/The_Power_of_the_Seed.png",
    link: "/ebooks/the-power-of-the-seed",
  },
];

const OFFERINGS_SUMMARY = [
  {
    icon: BookOpen,
    title: "Digital Ebooks",
    tags: ["Instant PDF", "Read Anywhere", "Lifetime Access"],
    description:
      "Short, honest reads you can finish in an evening — own them outright, no subscription required.",
  },
  {
    icon: Sunrise,
    title: "Daily Walk Program",
    tags: ["Inbox Delivery", "Full Audio Archive", "Cancel Anytime"],
    description:
      "One quiet reflection in your inbox each morning, plus the full archive whenever you want to return.",
  },
  {
    icon: Feather,
    title: "Faith & Wisdom Blog",
    tags: ["Weekly Posts", "No Paywall", "Real Stories"],
    description:
      "Free reflections and stories, posted weekly, for anyone seeking quiet strength without commitment.",
  },
];

export default function HomeView() {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [activeVideoId, setActiveVideoId] = useState("jbVD41XvvoU");

  // Auto-advance hero slides
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 7000);
    return () => clearInterval(timer);
  }, []);

  const currentSlide = HERO_SLIDES[currentSlideIndex];

  const handleOpenVideo = (videoId: string) => {
    setActiveVideoId(videoId);
    setVideoModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#fafaf7] text-[#1a1d20]">
      <Navbar />

      {/* ─── Hero Section: Carousel / Slideshow inspired by actsoffaithmedia.com ─── */}
      <section className="relative min-h-[88vh] pt-24 sm:pt-28 flex items-center justify-center overflow-hidden border-b border-[#c5a059]/25">
        {/* Background Image Carousel with High Clarity & Soft Vignette */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide.id}
            initial={{ opacity: 0, scale: 1.03 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute inset-0 z-0"
          >
            <Image
              src={currentSlide.image}
              alt={currentSlide.title}
              fill
              sizes="100vw"
              priority
              unoptimized
              className="object-cover object-center opacity-100"
            />
            {/* Minimal subtle gradient at top and bottom to keep nav and slide dots legible while image is 100% crystal clear */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(to bottom, rgba(250, 250, 247, 0.25) 0%, rgba(250, 250, 247, 0.05) 50%, rgba(250, 250, 247, 0.5) 100%)",
              }}
            />
          </motion.div>
        </AnimatePresence>

        {/* Carousel Prev/Next Buttons */}
        <button
          onClick={() =>
            setCurrentSlideIndex(
              (prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length
            )
          }
          className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full border border-[#c5a059]/50 bg-white/90 text-[#1a1d20] hover:bg-[#c5a059] hover:text-white transition-all duration-300 hidden sm:flex items-center justify-center shadow-lg"
          aria-label="Previous Slide"
        >
          <ChevronLeft size={22} />
        </button>

        <button
          onClick={() =>
            setCurrentSlideIndex((prev) => (prev + 1) % HERO_SLIDES.length)
          }
          className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full border border-[#c5a059]/50 bg-white/90 text-[#1a1d20] hover:bg-[#c5a059] hover:text-white transition-all duration-300 hidden sm:flex items-center justify-center shadow-lg"
          aria-label="Next Slide"
        >
          <ChevronRight size={22} />
        </button>

        {/* Hero Central Content Box with Glass Backdrop for Text Clarity */}
        <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 py-12 text-center">
          <GlassCard className="p-6 sm:p-10 border border-[#c5a059]/40 bg-white/85 backdrop-blur-md shadow-2xl rounded-3xl space-y-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="space-y-6 flex flex-col items-center"
              >
                {/* Play Video Trigger Button (Blur Circle with Gold Ring) */}
                <div
                  onClick={() => handleOpenVideo(currentSlide.videoId)}
                  className="group relative cursor-pointer mb-1 flex items-center justify-center"
                >
                  <div className="absolute inset-0 rounded-full bg-[#c5a059]/40 blur-md group-hover:bg-[#c5a059]/60 transition-all duration-300 animate-pulse" />
                  <div className="relative h-16 w-16 sm:h-20 sm:w-20 rounded-full border-2 border-[#c5a059] bg-white/95 backdrop-blur-md flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300">
                    <Play size={28} className="text-[#c5a059] ml-1 fill-[#c5a059]" />
                  </div>
                </div>

                {/* Slide Badge */}
                <Badge variant="gold" className="gap-2 px-3.5 py-1 text-xs">
                  <Sparkles size={13} className="text-[#c5a059]" />
                  {currentSlide.badge}
                </Badge>

                {/* Serif Display Title */}
                <h1 className="font-heading text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-[#1a1d20]">
                  {currentSlide.title}
                </h1>

                {/* Subheading */}
                <p className="max-w-xl text-sm sm:text-base text-[var(--color-text-secondary)] font-medium leading-relaxed">
                  {currentSlide.subtitle}
                </p>

                {/* Action Pill CTAs */}
                <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
                  <Button
                    href={currentSlide.ctaLink}
                    variant="gold"
                    size="lg"
                    className="w-full sm:w-auto shadow-lg"
                  >
                    {currentSlide.ctaText}
                  </Button>
                </div>
              </motion.div>
            </AnimatePresence>
          </GlassCard>

          {/* Carousel Slide Indicators */}
          <div className="mt-12 flex items-center justify-center gap-3">
            {HERO_SLIDES.map((slide, idx) => (
              <button
                key={slide.id}
                onClick={() => setCurrentSlideIndex(idx)}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  currentSlideIndex === idx
                    ? "w-8 bg-[#c5a059] shadow-md"
                    : "w-2.5 bg-black/20 hover:bg-black/40"
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ─── Video Lightbox Modal ─── */}
      <AnimatePresence>
        {videoModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/75 backdrop-blur-md"
            onClick={() => setVideoModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-4xl bg-white border border-[#c5a059]/40 rounded-2xl overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-black/10 bg-[#FAF8F5]">
                <div className="flex items-center gap-2">
                  <Play size={18} className="text-[#c5a059]" />
                  <span className="font-heading text-lg font-bold text-[#1a1d20]">
                    Featured Video Message
                  </span>
                </div>
                <button
                  onClick={() => setVideoModalOpen(false)}
                  className="p-1.5 rounded-full text-black/60 hover:text-black hover:bg-black/5 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Video Player Embed */}
              <div className="relative w-full aspect-video bg-black">
                <iframe
                  className="absolute inset-0 w-full h-full"
                  src={`https://www.youtube.com/embed/${activeVideoId}?autoplay=1`}
                  title="Grace Path Media Video"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Section 2: Products & Featured Offerings Showcase Grid ─── */}
      <section className="py-24 px-6 max-w-6xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <Badge variant="gold">Digital Media & Store</Badge>
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-[#1a1d20] tracking-tight">
            Featured Ebooks & Membership
          </h2>
          <p className="text-base text-[var(--color-text-secondary)] font-normal">
            Carefully written books, daily devotionals, and audio archives built to bring clarity to your morning routine.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {PRODUCTS.map((prod, index) => (
            <motion.div
              key={prod.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
            >
              <GlassCard className="p-6 h-full flex flex-col justify-between hover-gold-glow transition-all duration-300 border border-[#c5a059]/30 bg-white shadow-lg shadow-black/5 group">
                <div>
                  {/* Product Cover Image Container */}
                  <div className="relative aspect-[4/3] w-full rounded-xl overflow-hidden mb-6 bg-[#fafaf7] border border-black/10 group-hover:scale-[1.02] transition-transform duration-300">
                    <Image
                      src={prod.image}
                      alt={prod.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover object-center"
                    />
                    <div className="absolute top-3 right-3">
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#c5a059] text-white shadow-md">
                        {prod.price}
                      </span>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    {prod.tags.map((tag) => (
                      <Badge key={tag} variant="subtle" className="text-[11px] bg-black/5 text-[#4a505a]">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  {/* Product Title */}
                  <h3 className="font-heading text-xl sm:text-2xl font-bold text-[#1a1d20] mb-2 group-hover:text-[#c5a059] transition-colors">
                    {prod.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed mb-6 font-normal">
                    {prod.description}
                  </p>
                </div>

                <Button
                  href={prod.link}
                  variant="gold-outline"
                  size="md"
                  className="w-full justify-between group-hover:bg-[#c5a059]/15 transition-all"
                >
                  <span>Learn More</span>
                  <ArrowRight size={16} />
                </Button>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ─── Section 3: Voluntary Support Banner ─── */}
      <section className="py-16 px-6 max-w-6xl mx-auto">
        <div className="relative rounded-3xl overflow-hidden p-8 sm:p-12 border border-[#c5a059]/40 bg-gradient-to-r from-[#FAF5E8] via-[#FFFDF8] to-[#F5EFE0] shadow-xl">
          {/* Subtle Ambient Background Lighting */}
          <div className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full bg-[#c5a059]/10 blur-3xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
            <div className="lg:col-span-2 space-y-4">
              <Badge variant="gold" className="gap-1.5">
                <HeartHandshake size={14} className="text-[#c5a059]" />
                Voluntary Support
              </Badge>
              <h2 className="font-heading text-3xl sm:text-4xl font-bold text-[#1a1d20] tracking-tight">
                Voluntary Support For Digital Publications
              </h2>

              <p className="text-base text-[var(--color-text-secondary)] leading-relaxed max-w-xl font-normal">
                Your voluntary support helps us produce free weekly reflections, maintain digital channels, and provide complimentary access to readers in need around the world.
              </p>
              <div className="flex flex-wrap gap-4 pt-2 text-xs font-semibold text-[#c5a059]">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 size={16} className="text-[#c5a059]" />
                  <span>100% Direct Support</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 size={16} className="text-[#c5a059]" />
                  <span>Secure PayPal & Card</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 size={16} className="text-[#c5a059]" />
                  <span>Global Reach</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row lg:flex-col gap-4 justify-center">
              <Button href="/support" variant="gold" size="lg" className="w-full">
                <HeartHandshake size={18} />
                Provide Voluntary Support
              </Button>
              <Button href="/about" variant="gold-outline" size="lg" className="w-full">
                Learn About Our Mission
              </Button>
            </div>
          </div>
        </div>
      </section>


      {/* ─── Section 4: What You'll Find Here (3 Main Pillars) ─── */}
      <section className="py-20 px-6 max-w-6xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <p className="text-xs font-mono uppercase tracking-[0.25em] text-[#c5a059] font-bold">
            // Core Offerings
          </p>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-[#1a1d20]">
            Slow Down. Read Something True.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {OFFERINGS_SUMMARY.map((offering, index) => {
            const Icon = offering.icon;
            return (
              <motion.div
                key={offering.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
              >
                <GlassCard className="p-8 h-full flex flex-col justify-between hover-gold-glow border border-[#c5a059]/30 bg-white shadow-md">
                  <div>
                    {/* Golden Icon Container */}
                    <div className="h-14 w-14 rounded-2xl bg-[#c5a059]/15 border border-[#c5a059]/35 flex items-center justify-center mb-6 shadow-sm">
                      <Icon size={26} className="text-[#c5a059]" />
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {offering.tags.map((tag) => (
                        <Badge key={tag} variant="subtle" className="text-[10px] bg-black/5 text-[#4a505a]">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    {/* Title & description */}
                    <h3 className="font-heading text-xl font-bold text-[#1a1d20] mb-3">
                      {offering.title}
                    </h3>
                    <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed font-normal">
                      {offering.description}
                    </p>
                  </div>
                </GlassCard>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ─── Section 5: Trust Metrics / Statistics ─── */}
      <section className="py-16 px-6 max-w-6xl mx-auto border-t border-black/10">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
          <GlassCard className="p-6 border border-[#c5a059]/30 bg-white shadow-md flex flex-col items-center">
            <Clock size={28} className="text-[#c5a059] mb-2" />
            <p className="font-heading text-3xl font-bold text-[#1a1d20]">12 Min</p>
            <p className="text-xs text-[var(--color-text-muted)] mt-1">Average Quiet Reading Time</p>
          </GlassCard>

          <GlassCard className="p-6 border border-[#c5a059]/30 bg-white shadow-md flex flex-col items-center">
            <Users size={28} className="text-[#c5a059] mb-2" />
            <p className="font-heading text-3xl font-bold text-[#1a1d20]">50,000+</p>
            <p className="text-xs text-[var(--color-text-muted)] mt-1">Active Global Readers</p>
          </GlassCard>

          <GlassCard className="p-6 border border-[#c5a059]/30 bg-white shadow-md flex flex-col items-center">
            <Globe2 size={28} className="text-[#c5a059] mb-2" />
            <p className="font-heading text-3xl font-bold text-[#1a1d20]">100+ Countries</p>
            <p className="text-xs text-[var(--color-text-muted)] mt-1">Spreading Faith Worldwide</p>
          </GlassCard>
        </div>
      </section>

      <Footer />
    </div>
  );
}


