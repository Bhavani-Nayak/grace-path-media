import { NextRequest, NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/services/firebase-admin";
import { hasPurchase } from "@/services/purchase-service";
import { getOrderByPaypalId } from "@/services/order-service";
import { HARDCODED_EBOOKS } from "@/lib/ebook-data";
import {
  isCloudinaryConfigured,
  generateCloudinaryDownloadUrl,
} from "@/lib/cloudinary";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const productId = searchParams.get("productId") || searchParams.get("ebookId");
    const publicId = searchParams.get("publicId");
    const token = searchParams.get("token");

    const authHeader = request.headers.get("Authorization");
    let uid: string | null = null;

    if (authHeader?.startsWith("Bearer ")) {
      try {
        const idToken = authHeader.split("Bearer ")[1];
        const decoded = await adminAuth.verifyIdToken(idToken);
        uid = decoded.uid;
      } catch {
        // Token invalid - handle below
      }
    }

    if (!productId && !publicId) {
      return NextResponse.json(
        { error: "Product ID or Cloudinary Public ID is required" },
        { status: 400 }
      );
    }

    // Verify ownership via user UID or order token
    let isOwned = false;
    let targetEbook = HARDCODED_EBOOKS.find(
      (b) => b.id === productId || b.slug === productId
    );

    if (uid && (productId || targetEbook)) {
      const checkId = targetEbook?.id || productId!;
      isOwned = await hasPurchase(uid, checkId);
    }

    if (!isOwned && token) {
      try {
        const order = await getOrderByPaypalId(token);
        if (order && order.status === "paid") {
          const matchesProduct =
            !productId ||
            order.productId === productId ||
            order.productId === targetEbook?.id ||
            order.productId === targetEbook?.slug;
          const matchesUser = !uid || order.uid === uid;
          if (matchesProduct && matchesUser) {
            isOwned = true;
          }
        }
      } catch {
        // Order token invalid
      }
    }

    // Direct Cloudinary Public ID download allowed if authenticated or valid token
    if (!isOwned && publicId && uid) {
      isOwned = true;
    }

    if (!isOwned) {
      return NextResponse.json(
        { error: "Access denied. Valid purchase or order token required." },
        { status: 403 }
      );
    }

    // Resolve Cloudinary Public ID
    let cloudinaryPublicId = publicId;
    if (!cloudinaryPublicId && targetEbook) {
      // Use storagePath or generate publicId based on ebook slug
      cloudinaryPublicId = targetEbook.storagePath || `ebooks/${targetEbook.slug}.pdf`;
    }

    if (!cloudinaryPublicId && productId) {
      try {
        const doc = await adminDb.collection("ebooks").doc(productId).get();
        if (doc.exists) {
          cloudinaryPublicId =
            doc.data()?.cloudinaryPublicId ||
            doc.data()?.storagePath ||
            `ebooks/${productId}.pdf`;
        }
      } catch {
        cloudinaryPublicId = `ebooks/${productId}.pdf`;
      }
    }

    if (!cloudinaryPublicId) {
      return NextResponse.json(
        { error: "Download file path not found" },
        { status: 404 }
      );
    }

    if (!isCloudinaryConfigured()) {
      return NextResponse.json(
        {
          error: "Cloudinary is not configured. Please set Cloudinary environment credentials.",
          isConfigured: false,
        },
        { status: 503 }
      );
    }

    const downloadUrl = generateCloudinaryDownloadUrl(cloudinaryPublicId, {
      expiresInMinutes: 30,
      attachment: targetEbook ? `${targetEbook.title.replace(/[^a-zA-Z0-9_]/g, "_")}.pdf` : true,
    });

    return NextResponse.json({
      success: true,
      provider: "cloudinary",
      downloadUrl,
      url: downloadUrl,
      publicId: cloudinaryPublicId,
    });
  } catch (error) {
    console.error("Cloudinary download API error:", error);
    return NextResponse.json(
      { error: "Failed to generate Cloudinary download URL" },
      { status: 500 }
    );
  }
}
