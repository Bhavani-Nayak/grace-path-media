import { type ReactNode } from "react";

interface BadgeProps {
  children: ReactNode;
  className?: string;
  variant?: "default" | "accent" | "subtle" | "gold";
}

export default function Badge({
  children,
  className = "",
  variant = "default",
}: BadgeProps) {
  const variants = {
    default:
      "bg-black/[0.04] text-[var(--color-text-secondary)] border border-black/[0.08]",
    accent:
      "bg-[#c5a059]/15 text-[#b38f38] border border-[#c5a059]/30",
    subtle:
      "bg-[#fafaf7] text-[var(--color-text-secondary)] border border-black/10",
    gold:
      "bg-[#c5a059]/15 text-[#997a2e] border border-[#c5a059]/40 font-semibold shadow-sm",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full px-3.5 py-1 text-xs font-medium tracking-wide ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  );
}

