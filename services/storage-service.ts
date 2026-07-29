/**
 * Generate a download URL for a file asset (Static Site Mode).
 */
export async function generateSignedUrl(
  storagePath: string,
  expiryMinutes: number = 15,
  options?: { isCloudinary?: boolean; publicId?: string; filename?: string }
): Promise<string> {
  // Static site mode: return path directly without Cloudinary/Firebase signed URL calls
  return storagePath;
}

