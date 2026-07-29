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
 * Generate an invoice record (Static Site Mode).
 * (Firestore saving commented out)
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
  const matchedEbook = HARDCODED_EBOOKS.find((b) => b.id === productId || b.slug === productId);
  const title = matchedEbook?.title ?? "Grace Path Media Digital eBook";

  return {
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
}

/**
 * Retrieve invoice by invoice number (Static Site Mode).
 * (Firestore queries commented out)
 */
export async function getInvoice(
  uid: string,
  invoiceNumberOrId: string
): Promise<InvoiceRecord | null> {
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

export async function getInvoiceByOrderId(
  orderId: string
): Promise<InvoiceRecord | null> {
  return getInvoice("guest", orderId);
}

