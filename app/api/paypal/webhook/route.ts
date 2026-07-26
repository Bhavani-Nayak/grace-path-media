import { NextResponse } from "next/server";
import { verifyWebhookSignature } from "@/services/paypal-service";
import { markOrderPaid, getOrderByPaypalId } from "@/services/order-service";
import { grantPurchase } from "@/services/purchase-service";
import { generateInvoiceForOrder } from "@/services/invoice-service";
import { upsertSubscription } from "@/services/subscription-service";

export async function POST(request: Request) {
  try {
    const body = await request.text();
    const webhookId = process.env.PAYPAL_WEBHOOK_ID;

    if (!webhookId) {
      console.error("PAYPAL_WEBHOOK_ID not configured");
      return NextResponse.json(
        { error: "Webhook not configured" },
        { status: 500 }
      );
    }

    // Collect PayPal transmission headers
    const headers: Record<string, string> = {};
    const headerNames = [
      "paypal-auth-algo",
      "paypal-cert-url",
      "paypal-transmission-id",
      "paypal-transmission-sig",
      "paypal-transmission-time",
    ];

    for (const name of headerNames) {
      const value = request.headers.get(name);
      if (value) headers[name] = value;
    }

    // Verify webhook signature via PayPal API
    const isValid = await verifyWebhookSignature(headers, body, webhookId);
    if (!isValid) {
      console.error("PayPal webhook signature verification failed");
      return NextResponse.json(
        { error: "Invalid webhook signature" },
        { status: 401 }
      );
    }

    const event = JSON.parse(body);
    const eventType = event.event_type as string;

    switch (eventType) {
      case "PAYMENT.CAPTURE.COMPLETED": {
        const orderId = (event.resource?.supplementary_data?.related_ids?.order_id || event.resource?.id) as string | undefined;
        if (!orderId) {
          console.error("No order ID in webhook payload");
          break;
        }

        // Idempotent: markOrderPaid checks if already paid
        await markOrderPaid(orderId);

        // Grant purchase & generate invoice if the order has a uid
        const order = await getOrderByPaypalId(orderId);
        if (order) {
          const targetUid = order.uid || "guest";
          await grantPurchase(targetUid, order.productId, {
            paypalOrderId: orderId,
            amount: order.amount,
            currency: order.currency,
          });

          await generateInvoiceForOrder({
            paypalOrderId: orderId,
            uid: targetUid,
            customerEmail: order.email || event.resource?.payer?.email_address,
            productId: order.productId,
            amount: order.amount,
            currency: order.currency,
          });
        }
        break;
      }

      case "BILLING.SUBSCRIPTION.ACTIVATED":
      case "BILLING.SUBSCRIPTION.UPDATED": {
        const subResource = event.resource;
        const uid = subResource?.custom_id as string | undefined;
        if (!uid) break;

        await upsertSubscription({
          uid,
          paypalSubscriptionId: subResource.id,
          planId: subResource.plan_id,
          planName: subResource.plan_id?.includes("MONTHLY")
            ? "Monthly"
            : "Yearly",
          status: "active",
          startDate: new Date(subResource.start_time ?? Date.now()),
          currentPeriodEnd: subResource.billing_info?.next_billing_time
            ? new Date(subResource.billing_info.next_billing_time)
            : undefined,
        });
        break;
      }

      case "BILLING.SUBSCRIPTION.CANCELLED":
      case "BILLING.SUBSCRIPTION.SUSPENDED": {
        const subResource = event.resource;
        const uid = subResource?.custom_id as string | undefined;
        if (!uid) break;

        await upsertSubscription({
          uid,
          paypalSubscriptionId: subResource.id,
          planId: subResource.plan_id,
          planName: "",
          status: eventType.includes("CANCELLED") ? "cancelled" : "suspended",
          startDate: new Date(subResource.start_time ?? Date.now()),
          cancelledAt: new Date(),
        });
        break;
      }

      default:
        console.log(`Unhandled PayPal webhook event: ${eventType}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook processing error:", error);
    // Return 200 even on processing errors to prevent PayPal retries
    // The idempotent writes mean retries are safe anyway
    return NextResponse.json({ received: true });
  }
}
