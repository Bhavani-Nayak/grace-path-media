"use client";

import { use, useState } from "react";
import { useEbookDetailViewModel } from "@/viewmodels/useEbookDetailViewModel";
import EbookDetailView from "@/components/views/EbookDetailView";
import PayPalCheckoutButton from "@/components/paypal/PayPalCheckoutButton";

export default function EbookDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const vm = useEbookDetailViewModel(slug);
  const [customAmount, setCustomAmount] = useState<string>("");

  const displayPrice = vm.ebook?.isPayWhatYouWant
    ? customAmount.trim() === ""
      ? "0.00"
      : !isNaN(Number(customAmount))
      ? customAmount
      : "0.00"
    : vm.ebook
    ? (vm.ebook.price / 100).toFixed(2)
    : "0.00";

  const checkoutSlot = vm.ebook ? (
    <div className="space-y-4">
      {vm.ebook.isPayWhatYouWant && (
        <div className="space-y-2 text-left">
          <label className="text-xs font-bold text-[#1a1d20] uppercase tracking-wider block">
            Enter your desired price:
          </label>
          <div className="flex items-center border-2 border-[#c5a059] rounded-xl overflow-hidden bg-white shadow-sm">
            <span className="px-3.5 text-base font-bold text-[#1a1d20] bg-[#FAF5E8] py-3 border-r border-[#c5a059]/30">
              $
            </span>
            <input
              type="number"
              min="1"
              step="0.01"
              value={customAmount}
              onChange={(e) => setCustomAmount(e.target.value)}
              placeholder="Enter amount (e.g. 10.00)"
              className="w-full px-3.5 py-3 text-base font-bold text-[#1a1d20] outline-none placeholder:text-slate-400"
            />
            <span className="px-3 text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider">
              USD
            </span>
          </div>
        </div>
      )}

      <PayPalCheckoutButton
        productId={vm.ebook.id}
        productSlug={vm.ebook.slug}
        amount={vm.ebook.price}
        isPayWhatYouWant={vm.ebook.isPayWhatYouWant}
        customAmount={customAmount}
      />
    </div>
  ) : null;

  return (
    <EbookDetailView
      {...vm}
      checkoutSlot={checkoutSlot}
      customPriceDisplay={`$${displayPrice}`}
    />
  );
}



