export interface Order {
  paypalOrderId: string;
  productId: string;
  productType: "ebook"; // extensible for future product types
  email: string;
  uid?: string; // present if buyer was signed in
  amount: number; // USD cents
  currency: string;
  status: "pending" | "paid" | "failed" | "refunded";
  createdAt: Date;
  capturedAt?: Date;
}
