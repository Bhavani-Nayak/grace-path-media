import { NextResponse } from "next/server";
import { z } from "zod";
import { capturePayPalOrder } from "@/services/paypal-service";
import { markOrderPaid, getOrderByPaypalId } from "@/services/order-service";
import { grantPurchase } from "@/services/purchase-service";
import { generateInvoiceForOrder } from "@/services/invoice-service";

const bodySchema = z.object({
  orderId: z.string().min(1, "orderId is required"),
  uid: z.string().optional(), // present if buyer was signed in
});

export async function POST(request: Request) {
  try {
    const rawBody = await request.json();
    const parsed = bodySchema.safeParse(rawBody);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const { orderId, uid } = parsed.data;

    // Capture payment server-side — client "approved" is never proof of payment
    const captureResult = await capturePayPalOrder(orderId);

    if (captureResult.status !== "COMPLETED") {
      return NextResponse.json(
        { error: "Payment was not completed" },
        { status: 400 }
      );
    }

    // Grant purchase entitlement & generate invoice
    const order = await getOrderByPaypalId(orderId);
    const targetUid = uid || order?.uid || "guest";
    const productId = order?.productId || "whispers-of-grace";
    const amount = order?.amount || 1997;
    const currency = order?.currency || "USD";
    const email = order?.email || captureResult.payerEmail || "buyer@example.com";

    // Mark order as paid (idempotent, creates order if not present)
    await markOrderPaid(orderId, {
      productId,
      amount,
      currency,
      email,
      uid: targetUid,
    });

    let invoiceNumber = `INV-${new Date().getFullYear()}-${Date.now().toString().slice(-6)}`;
    try {
      await grantPurchase(targetUid, productId, {
        paypalOrderId: orderId,
        amount,
        currency,
      });

      const invoice = await generateInvoiceForOrder({
        paypalOrderId: orderId,
        uid: targetUid,
        customerEmail: email,
        productId,
        amount,
        currency,
      });
      invoiceNumber = invoice.invoiceNumber;
    } catch (err) {
      console.warn("Capture purchase grant fallback:", err);
    }

    return NextResponse.json({
      success: true,
      orderId,
      status: captureResult.status,
      invoiceNumber,
    });
  } catch (error) {
    console.error("Capture order error:", error);
    return NextResponse.json(
      { error: "Payment capture failed. Please contact support." },
      { status: 500 }
    );
  }
}
