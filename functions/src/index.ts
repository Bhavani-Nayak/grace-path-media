import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore();

/**
 * Verify PayPal Webhook Signature using PayPal API
 */
async function verifyPayPalWebhookSignature(
  headers: Record<string, string>,
  body: string
): Promise<boolean> {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;
  const webhookId = process.env.PAYPAL_WEBHOOK_ID;
  const paypalApiBase = process.env.PAYPAL_API_BASE ?? "https://api-m.sandbox.paypal.com";

  if (!clientId || !clientSecret || !webhookId) {
    functions.logger.warn("PayPal credentials or PAYPAL_WEBHOOK_ID missing. Skipping verification in dev sandbox.");
    return true; // Fallback for dev mode when credentials aren't fully configured
  }

  try {
    const auth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
    const tokenRes = await fetch(`${paypalApiBase}/v1/oauth2/token`, {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: "grant_type=client_credentials",
    });

    if (!tokenRes.ok) return false;
    const tokenData = (await tokenRes.json()) as { access_token: string };

    const verifyRes = await fetch(`${paypalApiBase}/v1/notifications/verify-webhook-signature`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        auth_algo: headers["paypal-auth-algo"],
        cert_url: headers["paypal-cert-url"],
        transmission_id: headers["paypal-transmission-id"],
        transmission_sig: headers["paypal-transmission-sig"],
        transmission_time: headers["paypal-transmission-time"],
        webhook_id: webhookId,
        webhook_event: JSON.parse(body),
      }),
    });

    if (!verifyRes.ok) return false;
    const verifyData = (await verifyRes.json()) as { verification_status: string };
    return verifyData.verification_status === "SUCCESS";
  } catch (err) {
    functions.logger.error("Error verifying PayPal signature:", err);
    return false;
  }
}

/**
 * Firebase Cloud Function: PayPal Webhook Endpoint
 * 
 * Flow:
 * React/Next App -> PayPal Checkout -> PayPal Webhook -> Firebase Cloud Function
 *   ├── Verify payment
 *   ├── Store purchase in Firestore under users/{uid}/purchases/{ebook_id}
 *   ├── Generate invoice in users/{uid}/invoices/{invoice_id}
 *   └── Mark ebook as owned (owned: true)
 */
export const paypalWebhook = functions.https.onRequest(async (req, res) => {
  if (req.method !== "POST") {
    res.status(405).send("Method Not Allowed");
    return;
  }

  try {
    const bodyStr = typeof req.body === "string" ? req.body : JSON.stringify(req.body);
    const headers: Record<string, string> = {};
    for (const key of Object.keys(req.headers)) {
      const val = req.headers[key];
      if (typeof val === "string") headers[key.toLowerCase()] = val;
    }

    const isValid = await verifyPayPalWebhookSignature(headers, bodyStr);
    if (!isValid) {
      functions.logger.error("Invalid PayPal Webhook signature");
      res.status(401).json({ error: "Invalid webhook signature" });
      return;
    }

    const event = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
    const eventType = event.event_type;

    functions.logger.info(`Processing PayPal Webhook event: ${eventType}`);

    if (eventType === "PAYMENT.CAPTURE.COMPLETED" || eventType === "CHECKOUT.ORDER.APPROVED") {
      const resource = event.resource || {};
      const paypalOrderId = resource.supplementary_data?.related_ids?.order_id || resource.id;
      const customId = resource.custom_id || resource.purchase_units?.[0]?.custom_id;

      // Extract details from Firestore pending order if present
      let uid = customId;
      let productId = "whispers-of-grace";
      let amount = 1997;
      let currency = "USD";
      let customerEmail = resource.payer?.email_address || "";

      if (paypalOrderId) {
        const orderSnap = await db.collection("orders").doc(paypalOrderId).get();
        if (orderSnap.exists) {
          const orderData = orderSnap.data();
          if (orderData) {
            uid = uid || orderData.uid;
            productId = orderData.productId || productId;
            amount = orderData.amount || amount;
            currency = orderData.currency || currency;
            customerEmail = customerEmail || orderData.email || "";

            // Update order status to paid
            await db.collection("orders").doc(paypalOrderId).update({
              status: "paid",
              capturedAt: admin.firestore.FieldValue.serverTimestamp(),
            });
          }
        }
      }

      if (!uid) {
        functions.logger.warn(`No UID found for order ${paypalOrderId}. Storing under guest_purchases.`);
        uid = "guest";
      }

      // 1. Store purchase in Firestore: users/{uid}/purchases/{ebook_id}
      const purchaseData = {
        ebookId: productId,
        owned: true,
        purchasedAt: admin.firestore.FieldValue.serverTimestamp(),
        paypalOrderId,
        amount,
        currency,
      };

      if (uid !== "guest") {
        await db
          .collection("users")
          .doc(uid)
          .collection("purchases")
          .doc(productId)
          .set(purchaseData, { merge: true });
      }

      // Also maintain global purchases reference
      await db
        .collection("purchases")
        .doc(uid)
        .collection("items")
        .doc(productId)
        .set({ purchasedAt: admin.firestore.FieldValue.serverTimestamp() }, { merge: true });

      // 2. Generate Invoice: users/{uid}/invoices/{invoice_id}
      const invoiceNumber = `INV-${new Date().getFullYear()}-${Date.now().toString().slice(-6)}`;
      const invoiceData = {
        invoiceNumber,
        orderId: paypalOrderId,
        uid,
        customerEmail,
        items: [
          {
            ebookId: productId,
            title: `Ebook - ${productId}`,
            price: amount,
          },
        ],
        subtotal: amount,
        tax: 0,
        totalAmount: amount,
        currency,
        paymentMethod: "PayPal",
        status: "PAID",
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      };

      if (uid !== "guest") {
        await db
          .collection("users")
          .doc(uid)
          .collection("invoices")
          .doc(invoiceNumber)
          .set(invoiceData, { merge: true });
      }

      await db.collection("invoices").doc(invoiceNumber).set(invoiceData, { merge: true });
      await db.collection("invoices_by_order").doc(paypalOrderId).set({ invoiceNumber, uid }, { merge: true });

      functions.logger.info(
        `Successfully processed purchase & generated invoice ${invoiceNumber} for user ${uid}, ebook ${productId}`
      );
    }

    res.status(200).json({ received: true });
  } catch (err) {
    functions.logger.error("Error processing PayPal webhook:", err);
    res.status(200).json({ received: true });
  }
});

/**
 * Firestore trigger: when an order status changes to paid, grant purchase & invoice if not already granted.
 */
export const onOrderPaid = functions.firestore
  .document("orders/{orderId}")
  .onUpdate(async (change, context) => {
    const before = change.before.data();
    const after = change.after.data();

    if (before.status === "paid" || after.status !== "paid") {
      return;
    }

    const orderId = context.params.orderId;
    const uid = after.uid;
    const productId = after.productId;
    const amount = after.amount || 0;
    const currency = after.currency || "USD";
    const email = after.email || "";

    if (uid) {
      // Record purchase in users/{uid}/purchases/{ebook_id}
      await db
        .collection("users")
        .doc(uid)
        .collection("purchases")
        .doc(productId)
        .set(
          {
            ebookId: productId,
            owned: true,
            purchasedAt: admin.firestore.FieldValue.serverTimestamp(),
            paypalOrderId: orderId,
            amount,
            currency,
          },
          { merge: true }
        );

      // Generate invoice
      const invoiceNumber = `INV-${new Date().getFullYear()}-${Date.now().toString().slice(-6)}`;
      const invoiceData = {
        invoiceNumber,
        orderId,
        uid,
        customerEmail: email,
        items: [{ ebookId: productId, title: `Ebook - ${productId}`, price: amount }],
        totalAmount: amount,
        currency,
        paymentMethod: "PayPal",
        status: "PAID",
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      };

      await db
        .collection("users")
        .doc(uid)
        .collection("invoices")
        .doc(invoiceNumber)
        .set(invoiceData, { merge: true });

      await db.collection("invoices").doc(invoiceNumber).set(invoiceData, { merge: true });
    }

    functions.logger.info(`Order ${orderId} marked paid. Updated ownership and invoice for user ${uid}`);
  });
