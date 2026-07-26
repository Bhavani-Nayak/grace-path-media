import { NextResponse } from "next/server";
import { z } from "zod";
import { createPayPalOrder } from "@/services/paypal-service";
import { adminDb } from "@/services/firebase-admin";
import { createOrder } from "@/services/order-service";
import { checkRateLimit, getRateLimitKey } from "@/lib/rate-limit";
import { HARDCODED_EBOOKS } from "@/lib/ebook-data";

const bodySchema = z.object({
  productId: z.string().min(1, "productId is required"),
  amount: z.number().optional(), // Custom amount in cents (for pay-what-you-want)
});

export async function POST(request: Request) {
  try {
    const key = getRateLimitKey(request, "create-order");
    const { allowed } = checkRateLimit(key);
    if (!allowed) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    const rawBody = await request.json();
    const parsed = bodySchema.safeParse(rawBody);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const { productId, amount: customAmount } = parsed.data;
    const reqId = `create-order-${Date.now()}`;

    let price = 999;
    let title = "Grace Path Media eBook";
    let isPayWhatYouWant = false;
    let minPrice = 0;

    console.time(`${reqId}:firestore-ebook-lookup`);
    try {
      const ebookDoc = await adminDb.collection("ebooks").doc(productId).get();
      if (ebookDoc.exists) {
        price = ebookDoc.data()?.price as number;
        title = ebookDoc.data()?.title as string;
        isPayWhatYouWant = ebookDoc.data()?.isPayWhatYouWant === true;
        minPrice = ebookDoc.data()?.minPrice ?? 0;
      } else {
        const fallback = HARDCODED_EBOOKS.find((b) => b.id === productId || b.slug === productId);
        if (fallback) {
          price = fallback.price;
          title = fallback.title;
          isPayWhatYouWant = (fallback as any).isPayWhatYouWant === true;
          minPrice = (fallback as any).minPrice ?? 0;
        }
      }
    } catch {
      const fallback = HARDCODED_EBOOKS.find((b) => b.id === productId || b.slug === productId);
      if (fallback) {
        price = fallback.price;
        title = fallback.title;
        isPayWhatYouWant = (fallback as any).isPayWhatYouWant === true;
        minPrice = (fallback as any).minPrice ?? 0;
      }
    }
    console.timeEnd(`${reqId}:firestore-ebook-lookup`);

    // Use custom amount for pay-what-you-want products (validate minimum)
    if (customAmount !== undefined) {
      if (isPayWhatYouWant) {
        if (customAmount >= minPrice) {
          price = customAmount;
        } else {
          return NextResponse.json(
            { error: `Minimum amount is $${(minPrice / 100).toFixed(2)}` },
            { status: 400 }
          );
        }
      } else {
        // For non-pay-what-you-want, accept the amount if it matches or exceeds catalog price
        if (customAmount >= price) {
          price = customAmount;
        }
      }
    }

    let paypalOrderId = `PAYPAL-ORDER-${Date.now()}-${productId}`;
    console.time(`${reqId}:paypal-create-order`);
    try {
      if (process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID) {
        paypalOrderId = await createPayPalOrder(
          price,
          "USD",
          `Grace Path Media — ${title}`
        );
      }
    } catch (err) {
      console.warn("PayPal API fallback order ID generated:", err);
    }
    console.timeEnd(`${reqId}:paypal-create-order`);

    console.time(`${reqId}:firestore-save-order`);
    try {
      await createOrder({
        paypalOrderId,
        productId,
        productType: "ebook",
        email: "",
        amount: price,
        currency: "USD",
        status: "pending",
        createdAt: new Date(),
      });
    } catch (err) {
      console.warn("Order creation fallback log:", err);
    }
    console.timeEnd(`${reqId}:firestore-save-order`);

    console.log(`${reqId}: total price=${price}, product=${productId}, orderId=${paypalOrderId}`);
    return NextResponse.json({ orderId: paypalOrderId });
  } catch (error) {
    console.error("Create order error:", error);
    return NextResponse.json(
      { error: "Failed to create order. Please try again." },
      { status: 500 }
    );
  }
}

