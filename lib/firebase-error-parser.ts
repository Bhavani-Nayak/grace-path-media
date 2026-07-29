import { sanitizeErrorForUI, logTechnicalError } from "./error-utils";

/**
 * Utility to map raw authentication error codes and technical error messages
 * into user-friendly, professional error messages without exposing technical details.
 */
export function formatAuthError(err: unknown): string {
  if (!err) return "An unexpected error occurred. Please try again.";

  // Always log raw error to console for debugging
  logTechnicalError(err);

  let code = "";
  let message = "";

  if (typeof err === "object" && err !== null) {
    if ("code" in err && typeof (err as { code?: unknown }).code === "string") {
      code = (err as { code: string }).code;
    }
    if ("message" in err && typeof (err as { message?: unknown }).message === "string") {
      message = (err as { message: string }).message;
    }
  } else if (typeof err === "string") {
    message = err;
  }

  const targetStr = `${code} ${message}`.toLowerCase();

  if (
    targetStr.includes("auth/invalid-credential") ||
    targetStr.includes("auth/wrong-password") ||
    targetStr.includes("auth/user-not-found") ||
    targetStr.includes("invalid-credential")
  ) {
    return "Invalid email or password. Please check your credentials and try again.";
  }

  if (targetStr.includes("auth/email-already-in-use")) {
    return "An account with this email address already exists. Please sign in instead.";
  }

  if (targetStr.includes("auth/invalid-email")) {
    return "Please enter a valid email address.";
  }

  if (targetStr.includes("auth/weak-password")) {
    return "Password is too weak. Please enter a stronger password.";
  }

  if (targetStr.includes("auth/too-many-requests")) {
    return "Too many failed attempts. Please wait a few minutes before trying again.";
  }

  if (targetStr.includes("auth/popup-closed-by-user")) {
    return "Sign in window was closed before completing. Please try again.";
  }

  if (targetStr.includes("auth/popup-blocked")) {
    return "Sign in popup was blocked by your browser. Please allow popups for this site.";
  }

  if (targetStr.includes("auth/network-request-failed")) {
    return "Network error. Please check your internet connection and try again.";
  }

  if (targetStr.includes("auth/requires-recent-login")) {
    return "For security reasons, please sign in again before performing this action.";
  }

  if (targetStr.includes("auth/user-disabled")) {
    return "This account has been disabled. Please contact support for assistance.";
  }

  if (targetStr.includes("auth/operation-not-allowed")) {
    return "This sign-in method is currently disabled. Please contact support.";
  }

  return sanitizeErrorForUI(err, "Authentication failed. Please check your details and try again.");
}
