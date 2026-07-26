import { adminDb } from "./firebase-admin";
import type { Subscription } from "@/models/subscription";

const SUBSCRIPTIONS_COLLECTION = "subscriptions";

export async function upsertSubscription(sub: Subscription): Promise<void> {
  await adminDb
    .collection(SUBSCRIPTIONS_COLLECTION)
    .doc(sub.uid)
    .set(
      {
        ...sub,
        startDate: sub.startDate ?? new Date(),
      },
      { merge: true }
    );
}

export async function getSubscription(
  uid: string
): Promise<Subscription | null> {
  const docSnap = await adminDb
    .collection(SUBSCRIPTIONS_COLLECTION)
    .doc(uid)
    .get();

  if (!docSnap.exists) return null;

  const data = docSnap.data();
  if (!data) return null;

  return {
    uid: docSnap.id,
    paypalSubscriptionId: data.paypalSubscriptionId,
    planId: data.planId,
    planName: data.planName,
    status: data.status,
    startDate: data.startDate?.toDate?.() ?? new Date(),
    currentPeriodEnd: data.currentPeriodEnd?.toDate?.(),
    cancelledAt: data.cancelledAt?.toDate?.(),
  } as Subscription;
}

export async function cancelSubscription(uid: string): Promise<void> {
  await adminDb.collection(SUBSCRIPTIONS_COLLECTION).doc(uid).update({
    status: "cancelled",
    cancelledAt: new Date(),
  });
}
