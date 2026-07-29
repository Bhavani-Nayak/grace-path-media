"use client";

import { useState, useEffect } from "react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { getCurrentUser, onAuthStateChange, signInWithGoogle } from "@/services/auth-service";
import type { User } from "firebase/auth";
import Button from "@/components/ui/Button";
import { LogIn, ShoppingBag, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";

import { sanitizeErrorForUI, logTechnicalError } from "@/lib/error-utils";

interface PayPalCheckoutButtonProps {
  productId: string;
  productSlug: string;
  amount: number; // in cents
  isPayWhatYouWant?: boolean;
  customAmount?: string;
  /** Optional custom redirect URL after successful payment (defaults to /ebooks/{slug}/download) */
  successRedirect?: string;
}

export default function PayPalCheckoutButton({
  productId,
  productSlug,
  amount,
  isPayWhatYouWant,
  customAmount,
  successRedirect,
}: PayPalCheckoutButtonProps) {
  const [user, setUser] = useState<User | null>(getCurrentUser());
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const router = useRouter();

  const paypalClientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "test";

  useEffect(() => {
    const unsub = onAuthStateChange((u) => setUser(u));
    return () => unsub();
  }, []);

  const handleCreateOrder = async (): Promise<string> => {
    setErrorMessage(null);
    try {
      const res = await fetch("/api/paypal/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId,
          amount: isPayWhatYouWant && customAmount ? Math.round(parseFloat(customAmount) * 100) : amount,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to create order");
      }

      const data = await res.json();
      return data.orderId;
    } catch (err: any) {
      logTechnicalError(err);
      setErrorMessage(sanitizeErrorForUI(err, "Payment creation failed. Please try again."));
      throw err;
    }
  };

  const handleApprove = async (data: { orderID: string }) => {
    setIsProcessing(true);
    setErrorMessage(null);

    try {
      const res = await fetch("/api/paypal/capture-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: data.orderID,
          uid: user?.uid ?? "guest",
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to capture payment");
      }

      const captureData = await res.json();
      
      // Redirect to success/thank-you page
      if (successRedirect) {
        router.push(`${successRedirect}?token=${encodeURIComponent(captureData.orderId)}`);
      } else {
        router.push(`/thank-you?token=${encodeURIComponent(captureData.orderId)}`);
      }
    } catch (err: any) {
      setIsProcessing(false);
      logTechnicalError(err);
      setErrorMessage(sanitizeErrorForUI(err, "Payment processing failed. Please try again."));
    }
  };

  return (
    <div className="space-y-4">
      {errorMessage && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs font-semibold text-red-600 text-left">
          {errorMessage}
        </div>
      )}

      <div className="space-y-3">
        {paypalClientId !== "test" ? (
          <PayPalScriptProvider options={{ clientId: paypalClientId, currency: "USD" }}>
            <PayPalButtons
              style={{ layout: "vertical", shape: "rect", label: "pay" }}
              createOrder={handleCreateOrder}
              onApprove={handleApprove}
              onError={(err) => {
                console.error("PayPal Error:", err);
                setErrorMessage("PayPal checkout error. Please try again.");
              }}
            />
          </PayPalScriptProvider>
        ) : (
          // Sandbox/Dev mode button
          <Button
            onClick={async () => {
              setIsProcessing(true);
              try {
                const orderId = await handleCreateOrder();
                await handleApprove({ orderID: orderId });
              } catch (e) {
                setIsProcessing(false);
              }
            }}
            disabled={isProcessing}
            variant="gold"
            size="lg"
            className="w-full gap-2 py-4 font-bold shadow-lg"
          >
            <ShoppingBag size={20} />
            {isProcessing ? "Processing..." : "Buy Now"}
          </Button>
        )}

        <p className="text-[11px] text-[var(--color-text-muted)] text-center">
          🔒 Instant eBook delivery.
        </p>
      </div>
    </div>
  );
}

