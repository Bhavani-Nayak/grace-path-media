export interface PurchaseRecord {
  ebookId: string;
  owned: boolean;
  purchasedAt: Date;
  paypalOrderId?: string;
  amount?: number;
  currency?: string;
}

export async function grantPurchase(
  uid: string,
  productId: string,
  extraData?: { paypalOrderId?: string; amount?: number; currency?: string }
): Promise<void> {
  // No-op in static mode
}

export async function getUserPurchases(uid: string): Promise<string[]> {
  return [];
}

export async function hasPurchase(
  uid: string,
  productId: string
): Promise<boolean> {
  return true;
}


