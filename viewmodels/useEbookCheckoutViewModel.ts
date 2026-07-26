"use client";

import { useState, useCallback } from "react";

interface CheckoutState {
  isPurchasing: boolean;
  purchaseComplete: boolean;
  error: string | null;
  orderId: string | null;
}

export function useEbookCheckoutViewModel(productId: string) {
  const [state, setState] = useState<CheckoutState>({
    isPurchasing: false,
    purchaseComplete: false,
    error: null,
    orderId: null,
  });

  const createOrder = useCallback(async (): Promise<string> => {
    setState((prev) => ({ ...prev, isPurchasing: true, error: null }));

    try {
      const res = await fetch("/api/paypal/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Failed to create order");
      }

      const data = await res.json();
      return data.orderId as string;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to create order";
      setState((prev) => ({ ...prev, isPurchasing: false, error: message }));
      throw err;
    }
  }, [productId]);

  const onApprove = useCallback(
    async (data: { orderID: string }): Promise<void> => {
      try {
        const res = await fetch("/api/paypal/capture-order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orderId: data.orderID }),
        });

        if (!res.ok) {
          const responseData = await res.json();
          throw new Error(responseData.error ?? "Payment capture failed");
        }

        setState((prev) => ({
          ...prev,
          isPurchasing: false,
          purchaseComplete: true,
          orderId: data.orderID,
        }));
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Payment failed";
        setState((prev) => ({
          ...prev,
          isPurchasing: false,
          error: message,
        }));
      }
    },
    []
  );

  const onError = useCallback((err: Record<string, unknown>) => {
    console.error("PayPal error:", err);
    setState((prev) => ({
      ...prev,
      isPurchasing: false,
      error: "Payment was cancelled or encountered an error. Please try again.",
    }));
  }, []);

  return {
    ...state,
    createOrder,
    onApprove,
    onError,
  };
}
