"use client";

import { useState, useCallback } from "react";

const DEFAULT_PAYPAL_URL =
  process.env.NEXT_PUBLIC_PAYPAL_SUPPORT_URL ||
  "https://www.paypal.me/bhavaninayak";

const PAYPAL_MONTHLY_URL =
  process.env.NEXT_PUBLIC_PAYPAL_MONTHLY_PLAN_URL || DEFAULT_PAYPAL_URL;

const PAYPAL_YEARLY_URL =
  process.env.NEXT_PUBLIC_PAYPAL_YEARLY_PLAN_URL || DEFAULT_PAYPAL_URL;

export interface MembershipPlan {
  id: string;
  name: string;
  price: string;
  period: string;
  amountCents: number;
  description: string;
  features: string[];
  planId: string;
  paypalUrl: string;
  popular?: boolean;
}

const plans: MembershipPlan[] = [
  {
    id: "monthly",
    name: "Monthly Experience",
    price: "$7",
    period: "/month",
    amountCents: 700, // $7.00 USD fixed
    description: "Daily devotional messages and spiritual encouragement delivered every morning.",
    features: [
      "Daily personal devotional message",
      "Full digital archive access",
      "Cancel anytime easily",
      "Early access to new eBook publications",
      "Morning prayer & Scripture guidance",
    ],
    planId: process.env.NEXT_PUBLIC_PAYPAL_MONTHLY_PLAN_ID || "MONTHLY_DEVOTIONAL",
    paypalUrl: PAYPAL_MONTHLY_URL,
  },
  {
    id: "yearly",
    name: "Full Annual Access",
    price: "$60",
    period: "/year",
    amountCents: 6000, // $60.00 USD fixed
    description: "Full access to all devotional experiences, digital archives, and future features.",
    features: [
      "Everything in Monthly Experience",
      "Save $24/year (2 months free)",
      "Exclusive yearly reflections & study guides",
      "Priority customer & prayer support",
      "Lifetime access to special editions",
    ],
    planId: process.env.NEXT_PUBLIC_PAYPAL_YEARLY_PLAN_ID || "YEARLY_DEVOTIONAL",
    paypalUrl: PAYPAL_YEARLY_URL,
    popular: true,
  },
];

export function useMembershipViewModel() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const subscribe = useCallback(async (plan: MembershipPlan) => {
    try {
      setIsLoading(true);
      setError(null);

      const res = await fetch("/api/membership/create-subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId: plan.planId }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.approvalUrl) {
          window.location.href = data.approvalUrl;
          return;
        }
      }

      // Fallback directly to PayPal subscription URL if API endpoint is standard fallback
      window.location.href = plan.paypalUrl;
    } catch {
      window.location.href = plan.paypalUrl;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { plans, isLoading, error, subscribe };
}

