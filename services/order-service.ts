import { adminDb } from "./firebase-admin";
import type { Order } from "@/models/order";

const ORDERS_COLLECTION = "orders";

export async function createOrder(order: Order): Promise<void> {
  // Idempotent write keyed by paypalOrderId
  const docRef = adminDb.collection(ORDERS_COLLECTION).doc(order.paypalOrderId);
  const existing = await docRef.get();

  if (existing.exists) {
    // Already created — skip
    return;
  }

  await docRef.set({
    ...order,
    createdAt: order.createdAt ?? new Date(),
  });
}

export async function getOrderByPaypalId(
  paypalOrderId: string
): Promise<Order | null> {
  const docSnap = await adminDb
    .collection(ORDERS_COLLECTION)
    .doc(paypalOrderId)
    .get();

  if (!docSnap.exists) return null;

  const data = docSnap.data();
  if (!data) return null;

  return {
    paypalOrderId: docSnap.id,
    productId: data.productId,
    productType: data.productType ?? "ebook",
    email: data.email,
    uid: data.uid,
    amount: data.amount,
    currency: data.currency,
    status: data.status,
    createdAt: data.createdAt?.toDate?.() ?? new Date(),
    capturedAt: data.capturedAt?.toDate?.(),
  } as Order;
}

export async function markOrderPaid(
  paypalOrderId: string,
  extraOrderInfo?: Partial<Order>
): Promise<void> {
  const docRef = adminDb.collection(ORDERS_COLLECTION).doc(paypalOrderId);

  try {
    await adminDb.runTransaction(async (transaction: any) => {
      const docSnap = await transaction.get(docRef);
      if (!docSnap.exists) {
        transaction.set(docRef, {
          paypalOrderId,
          productId: extraOrderInfo?.productId ?? "whispers-of-grace",
          productType: extraOrderInfo?.productType ?? "ebook",
          amount: extraOrderInfo?.amount ?? 0,
          currency: extraOrderInfo?.currency ?? "USD",
          email: extraOrderInfo?.email ?? "",
          uid: extraOrderInfo?.uid ?? "",
          status: "paid",
          createdAt: new Date(),
          capturedAt: new Date(),
        });
        return;
      }

      const data = docSnap.data();
      if (data?.status === "paid") {
        return;
      }

      transaction.update(docRef, {
        status: "paid",
        capturedAt: new Date(),
      });
    });
  } catch (err) {
    console.warn("markOrderPaid transaction fallback:", err);
    await docRef.set(
      {
        paypalOrderId,
        status: "paid",
        capturedAt: new Date(),
        ...extraOrderInfo,
      },
      { merge: true }
    );
  }
}
