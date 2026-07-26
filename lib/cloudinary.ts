import { v2 as cloudinary } from "cloudinary";

/**
 * Configure Cloudinary SDK instance with server-side environment credentials.
 */
const cloudName = process.env.CLOUDINARY_CLOUD_NAME || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "";
const apiKey = process.env.CLOUDINARY_API_KEY || "";
const apiSecret = process.env.CLOUDINARY_API_SECRET || "";

cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret,
  secure: true,
});

/**
 * Check if Cloudinary is fully configured with valid environment variables.
 */
export function isCloudinaryConfigured(): boolean {
  return (
    Boolean(cloudName) &&
    cloudName !== "DUMMY_REPLACE_ME" &&
    Boolean(apiKey) &&
    apiKey !== "DUMMY_REPLACE_ME" &&
    Boolean(apiSecret) &&
    apiSecret !== "DUMMY_REPLACE_ME"
  );
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
 *
 * IMPORTANT: PDFs uploaded via the Cloudinary Media Library UI are stored with
 * resource_type "image" (NOT "raw"). We must use resource_type "image" and
 * format "pdf" to generate a valid download URL.
 */
export function generateCloudinaryDownloadUrl(
  publicId: string,
  options: CloudinaryDownloadOptions = {}
): string {
  const {
    // PDFs uploaded via Cloudinary dashboard are stored as "image" type
    resourceType = "image",
    attachment = true,
    expiresInMinutes = 30,
    format = "pdf",
    type = "upload",
  } = options;

  const cleanPublicId = publicId.replace(/^\//, "").replace(/\.pdf$/i, "");
  const expiresAt = Math.floor(Date.now() / 1000) + expiresInMinutes * 60;

  // Generate Cloudinary's official signed private download API URL
  // This works even when "Blocked for delivery" is set, because it uses
  // the authenticated API endpoint rather than the CDN delivery URL.
  try {
    const privateUrl = cloudinary.utils.private_download_url(
      cleanPublicId,
      format,
      {
        resource_type: resourceType,
        type,
        expires_at: expiresAt,
        attachment: Boolean(attachment),
      }
    );
    if (privateUrl && privateUrl.startsWith("http")) {
      return privateUrl;
    }
  } catch (err) {
    console.warn("Cloudinary private_download_url warning:", err);
  }

  // Fallback: Standard signed Cloudinary CDN URL with .pdf extension
  const signedUrl = cloudinary.url(`${cleanPublicId}.${format}`, {
    resource_type: resourceType,
    type,
    sign_url: true,
    secure: true,
    flags: attachment ? ["attachment"] : undefined,
  });

  return signedUrl;
}

/**
 * Get a standard Cloudinary CDN URL for public assets (images, covers, etc.)
 */
export function getCloudinaryUrl(
  publicId: string,
  options: { resourceType?: "image" | "raw" | "video"; format?: string } = {}
): string {
  const { resourceType = "image", format } = options;
  return cloudinary.url(publicId, {
    resource_type: resourceType,
    format,
    secure: true,
  });
}

export { cloudinary };
