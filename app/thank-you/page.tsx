"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { useThankYouViewModel } from "@/viewmodels/useThankYouViewModel";
import ThankYouView from "@/components/views/ThankYouView";

function ThankYouContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const product = searchParams.get("product");
  const vm = useThankYouViewModel(token, product);
  return <ThankYouView {...vm} />;
}


export default function ThankYouPage() {
  return (
    <Suspense>
      <ThankYouContent />
    </Suspense>
  );
}
