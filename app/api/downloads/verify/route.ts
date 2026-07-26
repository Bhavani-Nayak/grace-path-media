import { NextRequest, NextResponse } from "next/server";
import { hasPurchase } from "@/services/purchase-service";
import { getEbookById, getEbookBySlug } from "@/services/ebook-service";
import { HARDCODED_EBOOKS } from "@/lib/ebook-data";
import { getOrderByPaypalId } from "@/services/order-service";
import { isCloudinaryConfigured, generateCloudinaryDownloadUrl } from "@/lib/cloudinary";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const uid = searchParams.get("uid");
    const ebookId = searchParams.get("ebookId");
    const token = searchParams.get("token");

    if (!ebookId) {
      return NextResponse.json(
        { error: "eBook ID or slug is required" },
        { status: 400 }
      );
    }

    // Identify eBook metadata
    const matchedEbook =
      (await getEbookById(ebookId)) ||
      (await getEbookBySlug(ebookId)) ||
      HARDCODED_EBOOKS.find((b) => b.id === ebookId || b.slug === ebookId);

    if (!matchedEbook) {
      return NextResponse.json(
        { error: "eBook not found" },
        { status: 404 }
      );
    }

    // Verify ownership in Firestore: users/{uid}/purchases/{ebook_id}
    let isOwned = false;
    if (uid) {
      isOwned = await hasPurchase(uid, matchedEbook.id);
      if (!isOwned && matchedEbook.slug) {
        isOwned = await hasPurchase(uid, matchedEbook.slug);
      }
    }

    // Token verification: check that token is a real paid order ID
    if (!isOwned && token) {
      try {
        const order = await getOrderByPaypalId(token);
        if (order && order.status === "paid") {
          // Verify the order matches this ebook and this user
          const orderMatchesProduct =
            order.productId === matchedEbook.id ||
            order.productId === matchedEbook.slug;
          const orderMatchesUser = !uid || order.uid === uid;

          if (orderMatchesProduct && orderMatchesUser) {
            isOwned = true;
          }
        }
      } catch {
        // Token didn't match any order — denied
      }
    }

    if (!isOwned) {
      return NextResponse.json(
        {
          owned: false,
          error: "You have not purchased this eBook or are not logged into the correct account.",
        },
        { status: 403 }
      );
    }

    // Generate download URL via Cloudinary if configured, otherwise static/signed storage URL
    let downloadUrl = matchedEbook.pdfUrl;
    if (isCloudinaryConfigured()) {
      const publicId = matchedEbook.storagePath || `ebooks/${matchedEbook.slug}.pdf`;
      downloadUrl = generateCloudinaryDownloadUrl(publicId, {
        expiresInMinutes: 30,
        attachment: `${matchedEbook.title.replace(/[^a-zA-Z0-9_]/g, "_")}.pdf`,
      });
    }

    return NextResponse.json({
      owned: true,
      ebookId: matchedEbook.id,
      title: matchedEbook.title,
      downloadUrl,
      coverUrl: matchedEbook.coverUrl,
      storageProvider: isCloudinaryConfigured() ? "cloudinary" : "local",
    });
  } catch (error) {
    console.error("Download verification error:", error);
    return NextResponse.json(
      { error: "Failed to verify eBook ownership" },
      { status: 500 }
    );
  }
}
