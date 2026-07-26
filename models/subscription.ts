export interface Subscription {
  uid: string;
  paypalSubscriptionId: string;
  planId: string;
  planName: string; // "Monthly" | "Yearly"
  status: "active" | "cancelled" | "suspended" | "expired";
  startDate: Date;
  currentPeriodEnd?: Date;
  cancelledAt?: Date;
}
