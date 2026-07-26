import { type ReactNode } from "react";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  strong?: boolean;
  onClick?: () => void;
}

export default function GlassCard({
  children,
  className = "",
  strong = false,
  onClick,
}: GlassCardProps) {
  return (
    <div
      className={`${strong ? "liquid-glass-strong" : "liquid-glass"} rounded-card ${className}`}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {children}
    </div>
  );
}
