import type { Subscription } from "@/models/subscription";

export async function upsertSubscription(sub: Subscription): Promise<void> {
  // No-op in static mode
}

export async function getSubscription(
  uid: string
): Promise<Subscription | null> {
  return null;
}

export async function cancelSubscription(uid: string): Promise<void> {
  // No-op in static mode
}

