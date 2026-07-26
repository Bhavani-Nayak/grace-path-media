import Link from "next/link";
import Image from "next/image";

const footerLinks = {
  explore: [
    { label: "Ebooks & Media", href: "/ebooks" },
    { label: "Daily Walk Program", href: "/membership" },
    { label: "Faith Blog", href: "/blog" },
    { label: "About Us", href: "/about" },
    { label: "Contact Us", href: "/contact" },
  ],
  support: [
    { label: "Support Our Mission", href: "/support" },
    { label: "My Downloads & Account", href: "/account/downloads" },
  ],

  legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Refund Policy", href: "/refund-policy" },
    { label: "DMCA Notice", href: "/dmca" },
  ],
};

const socialLinks = [
  {
    label: "Facebook",
    href: process.env.NEXT_PUBLIC_SOCIAL_FACEBOOK_URL ?? "#",
  },
  {
    label: "Instagram",
    href: process.env.NEXT_PUBLIC_SOCIAL_INSTAGRAM_URL ?? "#",
  },
  {
    label: "YouTube",
    href: process.env.NEXT_PUBLIC_SOCIAL_YOUTUBE_URL ?? "#",
  },
];

export default function Footer() {
  return (
    <footer className="relative z-0 border-t border-[#c5a059]/30 mt-auto bg-[#F4F2EC]">
      {/* Top ambient gold subtle glow line */}
      <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-[#c5a059]/60 to-transparent" />

      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="h-10 px-2.5 rounded-xl border border-[#c5a059]/40 bg-white flex items-center justify-center shadow-sm overflow-hidden">
                <Image
                  src="/images/gracePathLogo.png"
                  alt="Grace Path Logo"
                  width={34}
                  height={34}
                  className="object-contain"
                />
              </div>
              <span className="font-heading font-bold text-xl text-[#1a1d20] tracking-wide group-hover:text-[#c5a059] transition-colors">
                Grace Path <span className="text-[#c5a059] font-sans text-xs uppercase tracking-widest ml-1 font-bold">Media</span>
              </span>
            </Link>

            <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed max-w-sm font-light">
              Spreading faith, honest reflection, and peaceful wisdom through digital media to every corner of the world.
            </p>

            <div className="pt-2 flex items-center gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-1.5 rounded-full text-xs font-medium text-[var(--color-text-secondary)] border border-[#c5a059]/30 bg-white/60 hover:border-[#c5a059] hover:text-[#1a1d20] hover:bg-[#c5a059]/15 transition-all duration-300 shadow-sm"
                  id={`footer-social-${social.label.toLowerCase()}`}
                >
                  {social.label}
                </a>
              ))}
            </div>
          </div>

          {/* Explore Column */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#c5a059] mb-4">
              Explore
            </h3>
            <ul className="space-y-2.5">
              {footerLinks.explore.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-[var(--color-text-secondary)] hover:text-[#c5a059] transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Account & Giving Column */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#c5a059] mb-4">
              Account & Support
            </h3>
            <ul className="space-y-2.5">
              {footerLinks.support.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-[var(--color-text-secondary)] hover:text-[#c5a059] transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Column */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#c5a059] mb-4">
              Legal & Disclaimers
            </h3>
            <ul className="space-y-2.5">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-[var(--color-text-secondary)] hover:text-[#c5a059] transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom copyright notice */}
        <div className="mt-12 pt-8 border-t border-black/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <p className="text-xs text-[var(--color-text-muted)]">
            © {new Date().getFullYear()} Grace Path Media. Built for quiet mornings and faith. All rights reserved.
          </p>
          <p className="text-xs text-[var(--color-text-muted)]">
            Inspired by faith & community.
          </p>
        </div>
      </div>
    </footer>
  );
}
