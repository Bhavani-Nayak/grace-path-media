import { adminStorage } from "./firebase-admin";
import { isCloudinaryConfigured, generateCloudinaryDownloadUrl } from "@/lib/cloudinary";

/**
 * Generate a time-limited signed download URL for a file asset.
 * Supports Cloudinary when configured, with seamless fallback to Firebase Storage.
 */
export async function generateSignedUrl(
  storagePath: string,
  expiryMinutes: number = 15,
  options?: { isCloudinary?: boolean; publicId?: string; filename?: string }
): Promise<string> {
  // If explicitly requested as Cloudinary or path matches Cloudinary ID pattern and Cloudinary is configured
  if ((options?.isCloudinary || options?.publicId || storagePath.startsWith("cloudinary://")) && isCloudinaryConfigured()) {
    const publicId = options?.publicId || storagePath.replace("cloudinary://", "");
    return generateCloudinaryDownloadUrl(publicId, {
      expiresInMinutes: expiryMinutes,
      attachment: options?.filename || true,
    });
  }

  // Fallback if Cloudinary is configured globally and storage path isn't a firebase gs:// bucket path
  if (isCloudinaryConfigured() && !storagePath.includes("gs://") && !storagePath.includes("firebasestorage")) {
    try {
      return generateCloudinaryDownloadUrl(storagePath, {
        expiresInMinutes: expiryMinutes,
        attachment: options?.filename || true,
      });
    } catch {
      // Fallback to Firebase Storage below
    }
  }

  // Default: Firebase Storage signed URL
  const bucket = adminStorage.bucket();
  const file = bucket.file(storagePath);

  const [url] = await file.getSignedUrl({
    action: "read",
    expires: Date.now() + expiryMinutes * 60 * 1000,
  });

  return url;
}
