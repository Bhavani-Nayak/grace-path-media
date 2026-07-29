"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X, HeartHandshake, LogIn } from "lucide-react";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Ebooks", href: "/ebooks" },
  { label: "Membership", href: "/membership" },
  { label: "Blog", href: "/blog" },
  { label: "Support", href: "/support" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="fixed top-4 left-1/2 z-50 w-[calc(100%-2rem)] max-w-6xl -translate-x-1/2">
      <div className="liquid-glass-strong rounded-full px-5 py-2.5 flex items-center justify-between shadow-xl border border-[#c5a059]/35 bg-white/90 backdrop-blur-lg">
        {/* Rectangular Logo mark with rounded corners */}
        <Link href="/" className="flex items-center gap-3 group" id="navbar-logo">
          <div className="h-10 px-2.5 rounded-xl border border-[#c5a059]/40 bg-white flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform overflow-hidden">
            <Image
              src="/images/gracePathLogo.png"
              alt="Grace Path Logo"
              width={34}
              height={34}
              className="object-contain"
            />
          </div>
          <span className="font-heading font-bold text-lg sm:text-xl text-[#1a1d20] tracking-wide group-hover:text-[#c5a059] transition-colors">
            Grace Path <span className="text-[#c5a059] text-xs font-sans uppercase font-bold tracking-wider ml-1 hidden lg:inline-block">Media</span>
          </span>
        </Link>

        {/* Desktop center links */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                id={`nav-${link.label.toLowerCase()}`}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300 ${
                  isActive
                    ? "text-[#1a1d20] bg-[#c5a059]/20 border border-[#c5a059]/40 shadow-sm"
                    : "text-[var(--color-text-secondary)] hover:text-[#c5a059] hover:bg-[#c5a059]/10"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* CTA */}
        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/login"
            id="nav-login"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-semibold border border-[#c5a059]/50 text-[#1a1d20] bg-white/80 hover:bg-[#c5a059]/15 hover:border-[#c5a059] transition-all shadow-xs"
          >
            <LogIn size={15} className="text-[#c5a059]" />
            <span>Sign In</span>
          </Link>

          <Link
            href="/support"
            id="nav-support-now"
            className="btn-gold text-xs sm:text-sm px-4 py-2 flex items-center gap-1.5 hidden sm:inline-flex"
          >
            <HeartHandshake size={15} />
            <span>Support Our Mission</span>
          </Link>

          {/* Mobile menu toggle */}
          <button
            className="md:hidden p-2 text-[var(--color-text-secondary)] hover:text-[#c5a059]"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
            id="nav-mobile-toggle"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden mt-2 liquid-glass-strong rounded-2xl p-4 space-y-2 border border-[#c5a059]/30 bg-white/95 shadow-2xl">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className={`block px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                pathname === link.href
                  ? "text-[#1a1d20] bg-[#c5a059]/20 border border-[#c5a059]/30 font-bold"
                  : "text-[var(--color-text-secondary)] hover:text-[#c5a059] hover:bg-[#c5a059]/10"
              }`}
            >
              {link.label}
            </Link>
          ))}

          <div className="pt-2 border-t border-black/10 flex flex-col gap-2">
            <Link
              href="/login"
              onClick={() => setMobileOpen(false)}
              className="inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-semibold border border-[#c5a059]/40 text-[#1a1d20] bg-white hover:bg-[#c5a059]/10 transition-colors"
            >
              <LogIn size={16} className="text-[#c5a059]" />
              <span>Sign In / Sign Up</span>
            </Link>

            <Link
              href="/support"
              onClick={() => setMobileOpen(false)}
              className="btn-gold text-center py-2.5 text-sm font-semibold flex items-center justify-center gap-2"
            >
              <HeartHandshake size={16} />
              Support Our Mission
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}



