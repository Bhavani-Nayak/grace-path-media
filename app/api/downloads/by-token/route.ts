import { NextResponse } from "next/server";
import { getOrderByPaypalId } from "@/services/order-service";
import { generateSignedUrl } from "@/services/storage-service";
import { adminDb } from "@/services/firebase-admin";
import { HARDCODED_EBOOKS } from "@/lib/ebook-data";
import { isCloudinaryConfigured, generateCloudinaryDownloadUrl } from "@/lib/cloudinary";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const token = request.nextUrl.searchParams.get("token");
    const product = request.nextUrl.searchParams.get("product");

    if (!token && !product) {
      return NextResponse.json(
        { error: "Missing order token or product identifier" },
        { status: 400 }
      );
    }

    let productId = product;
    if (token) {
      try {
        const order = await getOrderByPaypalId(token);
        if (order) {
          productId = order.productId;
        }
      } catch {
        // Fallback
      }
    }

    if (!productId && token) {
      productId = token.replace(/^PAYPAL-ORDER-\d+-/, "");
    }

    const matchedEbook = HARDCODED_EBOOKS.find(
      (b) => b.id === productId || b.slug === productId || (token && token.includes(b.id)) || (token && token.includes(b.slug))
    );

    if (matchedEbook) {
      let downloadUrl = matchedEbook.pdfUrl;

      if (isCloudinaryConfigured()) {
        const publicId = matchedEbook.storagePath || `ebooks/${matchedEbook.slug}.pdf`;
        downloadUrl = generateCloudinaryDownloadUrl(publicId, {
          resourceType: "raw",
          expiresInMinutes: 30,
          attachment: `${matchedEbook.title.replace(/[^a-zA-Z0-9_]/g, "_")}.pdf`,
        });
      } else {
        downloadUrl = await generateSignedUrl(matchedEbook.storagePath || matchedEbook.pdfUrl, 15, {
          filename: `${matchedEbook.title.replace(/[^a-zA-Z0-9_]/g, "_")}.pdf`,
        });
      }

      return NextResponse.json({
        url: downloadUrl,
        downloadUrl,
        title: matchedEbook.title,
        productId: matchedEbook.id,
        storageProvider: isCloudinaryConfigured() ? "cloudinary" : "storage",
      });
    }

    if (!productId) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }

    try {
      const ebookDoc = await adminDb
        .collection("ebooks")
        .doc(productId)
        .get();

      if (ebookDoc.exists) {
        const storagePath = ebookDoc.data()?.storagePath as string;
        if (storagePath) {
          const url = await generateSignedUrl(storagePath, 15);
          return NextResponse.json({ url, downloadUrl: url, productId });
        }
      }
    } catch {
      // Ignore
    }

    return NextResponse.json(
      { error: "Product download not found" },
      { status: 404 }
    );
  } catch (error) {
    console.error("Download by token error:", error);
    return NextResponse.json(
      { error: "Failed to generate download link" },
      { status: 500 }
    );
  }
}
