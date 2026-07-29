import React from "react";
import { ShieldCheck, Download, Lock, Globe } from "lucide-react";

interface TrustBadgesProps {
  className?: string;
  variant?: "horizontal" | "grid" | "compact" | "pills";
}

export default function TrustBadges({
  className = "",
  variant = "horizontal",
}: TrustBadgesProps) {
  const badges = [
    {
      icon: ShieldCheck,
      title: "Secure Checkout",
      color: "bg-blue-50 text-blue-700 border-blue-200",
      iconColor: "text-blue-600",
    },
    {
      icon: Download,
      title: "Instant Digital Download",
      color: "bg-amber-50 text-amber-800 border-amber-200",
      iconColor: "text-amber-600",
    },
    {
      icon: Lock,
      title: "SSL Secured",
      color: "bg-emerald-50 text-emerald-800 border-emerald-200",
      iconColor: "text-emerald-600",
    },
    {
      icon: Globe,
      title: "Worldwide Access",
      color: "bg-indigo-50 text-indigo-700 border-indigo-200",
      iconColor: "text-indigo-600",
    },
  ];

  if (variant === "pills") {
    return (
      <div className={`flex flex-wrap items-center gap-2 ${className}`}>
        {badges.map((b) => {
          const Icon = b.icon;
          return (
            <span
              key={b.title}
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border shadow-xs ${b.color}`}
            >
              <Icon size={13} className={b.iconColor} />
              {b.title}
            </span>
          );
        })}
      </div>
    );
  }

  if (variant === "compact") {
    return (
      <div className={`grid grid-cols-2 gap-2 text-xs font-medium ${className}`}>
        {badges.map((b) => {
          const Icon = b.icon;
          return (
            <div
              key={b.title}
              className="flex items-center gap-1.5 p-2 rounded-lg bg-slate-50 border border-slate-200/80 text-slate-700"
            >
              <Icon size={14} className={b.iconColor} />
              <span className="truncate">{b.title}</span>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-2 sm:grid-cols-4 gap-3 ${className}`}>
      {badges.map((b) => {
        const Icon = b.icon;
        return (
          <div
            key={b.title}
            className={`flex items-center justify-center gap-2 p-3 rounded-xl border font-semibold text-xs transition-all shadow-xs ${b.color}`}
          >
            <Icon size={15} className={`shrink-0 ${b.iconColor}`} />
            <span className="text-center">{b.title}</span>
          </div>
        );
      })}
    </div>
  );
}
