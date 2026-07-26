import { adminDb } from "./firebase-admin";

export interface PurchaseRecord {
  ebookId: string;
  owned: boolean;
  purchasedAt: Date;
  paypalOrderId?: string;
  amount?: number;
  currency?: string;
}

/**
 * Grant ownership of an ebook to a user under users/{uid}/purchases/{productId}
 */
export async function grantPurchase(
  uid: string,
  productId: string,
  extraData?: { paypalOrderId?: string; amount?: number; currency?: string }
): Promise<void> {
  const purchaseData = {
    ebookId: productId,
    owned: true,
    purchasedAt: new Date(),
    paypalOrderId: extraData?.paypalOrderId ?? "",
    amount: extraData?.amount ?? 0,
    currency: extraData?.currency ?? "USD",
  };

  // Primary path requested by user schema: users/{uid}/purchases/{ebook_id}
  await adminDb
    .collection("users")
    .doc(uid)
    .collection("purchases")
    .doc(productId)
    .set(purchaseData, { merge: true });

  // Secondary legacy path write for backwards compatibility
  await adminDb
    .collection("purchases")
    .doc(uid)
    .collection("items")
    .doc(productId)
    .set({ purchasedAt: new Date() }, { merge: true });
}

/**
 * Retrieve list of purchased product IDs for a given user UID
 */
export async function getUserPurchases(uid: string): Promise<string[]> {
  const userPurchasesSnap = await adminDb
    .collection("users")
    .doc(uid)
    .collection("purchases")
    .get();

  if (!userPurchasesSnap.empty) {
    return userPurchasesSnap.docs
      .filter((doc: any) => doc.data().owned !== false)
      .map((doc: any) => doc.id);
  }

  // Fallback to legacy path
  const legacySnap = await adminDb
    .collection("purchases")
    .doc(uid)
    .collection("items")
    .get();

  return legacySnap.docs.map((doc: any) => doc.id);
}

/**
 * Check if user owns a specific ebook
 */
export async function hasPurchase(
  uid: string,
  productId: string
): Promise<boolean> {
  // Check users/{uid}/purchases/{productId} first
  const userDocSnap = await adminDb
    .collection("users")
    .doc(uid)
    .collection("purchases")
    .doc(productId)
    .get();

  if (userDocSnap.exists) {
    const data = userDocSnap.data();
    return data?.owned === true || data?.owned === undefined;
  }

  // Fallback check on legacy path
  const legacyDocSnap = await adminDb
    .collection("purchases")
    .doc(uid)
    .collection("items")
    .doc(productId)
    .get();

  return legacyDocSnap.exists;
}

