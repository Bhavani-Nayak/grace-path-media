/**
 * Utility functions for logging technical errors safely to the browser console
 * while keeping user-facing UI messages clean, polite, and free of technical service names (e.g., Firebase, Firestore, Cloudinary, status codes, etc.).
 */

const TECHNICAL_KEYWORDS = [
  "firebase",
  "firestore",
  "cloudinary",
  "mongodb",
  "sql",
  "grpc",
  "auth/",
  "code:",
  "500",
  "status code",
  "typeerror",
  "referenceerror",
  "uncaught",
  "syntaxerror",
  "networkerror",
  "sdk",
  "endpoint",
  "api/",
  "token",
  "internal server error",
  "failed to fetch",
  "econnrefused",
  "jwt",
  "cors",
  "stack",
  "unhandledrejection",
];

export function logTechnicalError(err: unknown): void {
  if (typeof window !== "undefined" || process.env.NODE_ENV !== "test") {
    console.error("[Console Only Technical Error Log]:", err);
  }
}

export function sanitizeErrorForUI(
  err: unknown,
  fallbackMessage = "An unexpected error occurred. Please try again later or contact support if the issue persists."
): string {
  if (!err) return "";

  // Always log raw technical error to console
  logTechnicalError(err);

  let rawMessage = "";

  if (typeof err === "string") {
    rawMessage = err;
  } else if (err && typeof err === "object") {
    if ("message" in err && typeof (err as { message?: unknown }).message === "string") {
      rawMessage = (err as { message: string }).message;
    } else {
      rawMessage = String(err);
    }
  }

  if (!rawMessage || rawMessage.trim() === "") {
    return fallbackMessage;
  }

  const lower = rawMessage.toLowerCase();

  // If error contains any technical keyword or stack trace patterns, return friendly user copy
  const isTechnical = TECHNICAL_KEYWORDS.some((kw) => lower.includes(kw));

  if (isTechnical) {
    // Provide polite context-specific friendly copy if recognizable, otherwise generic polite copy
    if (lower.includes("credential") || lower.includes("password") || lower.includes("user-not-found")) {
      return "Invalid email address or password. Please check your credentials and try again.";
    }
    if (lower.includes("email-already-in-use")) {
      return "An account with this email address already exists. Please sign in instead.";
    }
    if (lower.includes("network") || lower.includes("fetch")) {
      return "Network connection issue. Please check your internet connection and try again.";
    }
    if (lower.includes("popup")) {
      return "Sign in window was closed or blocked. Please allow popups and try again.";
    }

    return fallbackMessage;
  }

  // Strip any remaining technical prefixes if present
  let cleanMessage = rawMessage
    .replace(/^(error|uncaught error|exception):\s*/i, "")
    .replace(/^firebase:\s*/i, "")
    .replace(/^cloudinary:\s*/i, "");

  return cleanMessage || fallbackMessage;
}
