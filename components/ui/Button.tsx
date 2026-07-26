import { type ReactNode, type ButtonHTMLAttributes } from "react";
import Link from "next/link";

interface ButtonBaseProps {
  children: ReactNode;
  variant?: "glass" | "solid" | "text" | "gold" | "gold-outline";
  size?: "sm" | "md" | "lg";
  className?: string;
}

interface ButtonAsButton
  extends ButtonBaseProps,
    Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  href?: never;
}

interface ButtonAsLink extends ButtonBaseProps {
  href: string;
  onClick?: never;
  disabled?: never;
  type?: never;
}

type ButtonProps = ButtonAsButton | ButtonAsLink;

export default function Button({
  children,
  variant = "glass",
  size = "md",
  className = "",
  ...props
}: ButtonProps) {
  const sizes = {
    sm: "px-4 py-1.5 text-xs sm:text-sm",
    md: "px-6 py-2.5 text-sm",
    lg: "px-8 py-3.5 text-base font-semibold",
  };

  const variants = {
    glass: "liquid-glass-strong hover:bg-white/[0.06] text-[var(--color-text-primary)] transition-all duration-300 border border-white/10",
    solid:
      "bg-[var(--color-accent-warm)] text-[var(--color-bg-deep)] font-semibold hover:brightness-110 transition-all duration-300 shadow-md",
    text: "text-[var(--color-text-secondary)] hover:text-[#d4af37] transition-colors duration-300",
    gold: "btn-gold text-[#1a1d20]",
    "gold-outline": "btn-outline-gold",

  };

  const baseClass = `inline-flex items-center justify-center gap-2 rounded-full font-medium ${sizes[size]} ${variants[variant]} ${className}`;

  if ("href" in props && props.href) {
    return (
      <Link href={props.href} className={baseClass}>
        {children}
      </Link>
    );
  }

  const { href: _, ...buttonProps } = props as ButtonAsButton;
  return (
    <button className={baseClass} {...buttonProps}>
      {children}
    </button>
  );
}
