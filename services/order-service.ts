import type { Order } from "@/models/order";

export async function createOrder(order: Order): Promise<void> {
  // No-op in static mode
}

export async function getOrderByPaypalId(
  paypalOrderId: string
): Promise<Order | null> {
  return {
    paypalOrderId,
    productId: "whispers-of-grace",
    productType: "ebook",
    email: "customer@gracepathmedia.com",
    uid: "guest",
    amount: 1997,
    currency: "USD",
    status: "paid",
    createdAt: new Date(),
    capturedAt: new Date(),
  } as Order;
}

export async function markOrderPaid(
  paypalOrderId: string,
  extraOrderInfo?: Partial<Order>
): Promise<void> {
  // No-op in static mode
}

