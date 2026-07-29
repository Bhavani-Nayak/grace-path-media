/**
 * Check if Cloudinary is fully configured with valid environment variables.
 * (DISABLED FOR STATIC SITE MODE)
 */
export function isCloudinaryConfigured(): boolean {
  return false;
}

export interface CloudinaryDownloadOptions {
  resourceType?: "image" | "raw" | "video" | "auto";
  attachment?: boolean | string;
  expiresInMinutes?: number;
  format?: string;
  type?: "upload" | "private" | "authenticated";
}

/**
 * Generate a time-limited signed Cloudinary download URL for a PDF file asset.
 * (DISABLED FOR STATIC SITE MODE)
 */
export function generateCloudinaryDownloadUrl(
  publicId: string,
  options: CloudinaryDownloadOptions = {}
): string {
  return "";
}

/**
 * Get a standard Cloudinary CDN URL for public assets (images, covers, etc.)
 * (DISABLED FOR STATIC SITE MODE)
 */
export function getCloudinaryUrl(
  publicId: string,
  options: { resourceType?: "image" | "raw" | "video"; format?: string } = {}
): string {
  return "";
}

