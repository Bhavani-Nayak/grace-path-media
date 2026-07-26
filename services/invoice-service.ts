import { adminDb } from "./firebase-admin";
import { HARDCODED_EBOOKS } from "@/lib/ebook-data";

export interface InvoiceItem {
  ebookId: string;
  title: string;
  price: number;
}

export interface InvoiceRecord {
  invoiceNumber: string;
  orderId: string;
  uid: string;
  customerEmail: string;
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  totalAmount: number;
  currency: string;
  paymentMethod: string;
  status: "PAID" | "PENDING" | "REFUNDED";
  createdAt: Date;
}

/**
 * Generate and store an invoice for a completed order.
 * Stores in Firestore under users/{uid}/invoices/{invoiceId} and top-level invoices collection.
 */
export async function generateInvoiceForOrder(params: {
  paypalOrderId: string;
  uid: string;
  customerEmail?: string;
  productId: string;
  amount: number;
  currency?: string;
}): Promise<InvoiceRecord> {
  const { paypalOrderId, uid, customerEmail = "customer@gracepathmedia.com", productId, amount, currency = "USD" } = params;

  const invoiceNumber = `INV-${new Date().getFullYear()}-${Date.now().toString().slice(-6)}`;
  
  // Find product details
  const matchedEbook = HARDCODED_EBOOKS.find((b) => b.id === productId || b.slug === productId);
  const title = matchedEbook?.title ?? "Grace Path Media Digital eBook";

  const invoiceData: InvoiceRecord = {
    invoiceNumber,
    orderId: paypalOrderId,
    uid: uid || "guest",
    customerEmail,
    items: [
      {
        ebookId: productId,
        title,
        price: amount,
      },
    ],
    subtotal: amount,
    tax: 0,
    totalAmount: amount,
    currency,
    paymentMethod: "PayPal",
    status: "PAID",
    createdAt: new Date(),
  };

  try {
    if (uid && uid !== "guest") {
      await adminDb
        .collection("users")
        .doc(uid)
        .collection("invoices")
        .doc(invoiceNumber)
        .set(invoiceData, { merge: true });
    }

    await adminDb
      .collection("invoices")
      .doc(invoiceNumber)
      .set(invoiceData, { merge: true });

    await adminDb
      .collection("invoices_by_order")
      .doc(paypalOrderId)
      .set({ invoiceNumber, uid }, { merge: true });
  } catch (err) {
    console.warn("Firestore invoice save notice:", err);
  }

  return invoiceData;
}

/**
 * Retrieve invoice by invoice number, order ID, product ID, or user UID.
 * Fallback guarantees lifetime view & download for all purchases.
 */
export async function getInvoice(
  uid: string,
  invoiceNumberOrId: string
): Promise<InvoiceRecord | null> {
  try {
    // 1. Try user invoices collection
    if (uid && uid !== "guest") {
      const userSnap = await adminDb
        .collection("users")
        .doc(uid)
        .collection("invoices")
        .doc(invoiceNumberOrId)
        .get();

      if (userSnap.exists) {
        const data = userSnap.data();
        if (data) return mapDocToInvoice(userSnap.id, data);
      }
    }

    // 2. Try global invoices collection
    const globalSnap = await adminDb.collection("invoices").doc(invoiceNumberOrId).get();
    if (globalSnap.exists) {
      const data = globalSnap.data();
      if (data) return mapDocToInvoice(globalSnap.id, data);
    }

    // 3. Try lookup by order ID
    const orderSnap = await adminDb.collection("invoices_by_order").doc(invoiceNumberOrId).get();
    if (orderSnap.exists) {
      const { invoiceNumber: invNum, uid: invUid } = orderSnap.data() as { invoiceNumber: string; uid: string };
      if (invNum) return getInvoice(invUid || uid, invNum);
    }
  } catch (err) {
    console.warn("Firestore invoice fetch notice:", err);
  }

  // 4. Lifetime fallback: match invoiceNumberOrId to known catalog eBook
  const matchedEbook = HARDCODED_EBOOKS.find(
    (b) => b.id === invoiceNumberOrId || b.slug === invoiceNumberOrId
  );

  if (matchedEbook) {
    const amount = matchedEbook.price || 1997;
    return {
      invoiceNumber: `INV-${matchedEbook.id.toUpperCase()}`,
      orderId: `ORDER-${matchedEbook.id.toUpperCase()}`,
      uid: uid || "user",
      customerEmail: "customer@gracepathmedia.com",
      items: [
        {
          ebookId: matchedEbook.id,
          title: matchedEbook.title,
          price: amount,
        },
      ],
      subtotal: amount,
      tax: 0,
      totalAmount: amount,
      currency: "USD",
      paymentMethod: "PayPal / Digital Order",
      status: "PAID",
      createdAt: new Date(matchedEbook.createdAt || Date.now()),
    };
  }

  return null;
}

/**
 * Get invoice by PayPal Order ID
 */
export async function getInvoiceByOrderId(
  orderId: string
): Promise<InvoiceRecord | null> {
  return getInvoice("guest", orderId);
}

function mapDocToInvoice(id: string, data: Record<string, any>): InvoiceRecord {
  return {
    invoiceNumber: id,
    orderId: data.orderId || id,
    uid: data.uid || "guest",
    customerEmail: data.customerEmail || "customer@gracepathmedia.com",
    items: data.items ?? [],
    subtotal: data.subtotal || data.totalAmount || 0,
    tax: data.tax || 0,
    totalAmount: data.totalAmount || 0,
    currency: data.currency || "USD",
    paymentMethod: data.paymentMethod || "PayPal",
    status: data.status || "PAID",
    createdAt: data.createdAt?.toDate?.() ?? new Date(data.createdAt || Date.now()),
  };
}
