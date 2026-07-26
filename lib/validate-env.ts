import { z } from "zod";

const envSchema = z.object({
  PAYPAL_CLIENT_ID: z.string().min(1, "PAYPAL_CLIENT_ID is required"),
  PAYPAL_CLIENT_SECRET: z.string().min(1, "PAYPAL_CLIENT_SECRET is required"),
  PAYPAL_WEBHOOK_ID: z.string().min(1, "PAYPAL_WEBHOOK_ID is required"),
  FIREBASE_ADMIN_PROJECT_ID: z.string().min(1, "FIREBASE_ADMIN_PROJECT_ID is required"),
  FIREBASE_ADMIN_CLIENT_EMAIL: z.string().min(1, "FIREBASE_ADMIN_CLIENT_EMAIL is required"),
  FIREBASE_ADMIN_PRIVATE_KEY: z.string().min(1, "FIREBASE_ADMIN_PRIVATE_KEY is required"),
});

/**
 * Validate that all required server-side environment variables are set.
 * Call this at the top of API routes that need these values.
 * Throws a descriptive error if any are missing.
 */
export function validateServerEnv(): void {
  const result = envSchema.safeParse(process.env);
  if (!result.success) {
    const missing = result.error.issues
      .map((i) => `${i.path.join(".")}: ${i.message}`)
      .join(", ");
    throw new Error(`Missing environment variables: ${missing}`);
  }
}
