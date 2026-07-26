import { NextResponse } from "next/server";
import { adminAuth } from "@/services/firebase-admin";
import { hasPurchase } from "@/services/purchase-service";
import { generateSignedUrl } from "@/services/storage-service";
import { adminDb } from "@/services/firebase-admin";
import { HARDCODED_EBOOKS } from "@/lib/ebook-data";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ productId: string }> }
) {
  try {
    const { productId } = await params;

    // Verify authentication
    const authHeader = request.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const token = authHeader.split("Bearer ")[1];
    let uid: string;

    try {
      const decoded = await adminAuth.verifyIdToken(token);
      uid = decoded.uid;
    } catch {
      return NextResponse.json(
        { error: "Invalid authentication token" },
        { status: 401 }
      );
    }

    // Verify ownership
    const owned = await hasPurchase(uid, productId);
    if (!owned) {
      return NextResponse.json(
        { error: "You have not purchased this product" },
        { status: 403 }
      );
    }

    // Get the ebook metadata from Firestore or hardcoded catalog
    let storagePath: string | undefined;
    let title: string | undefined;

    const ebookDoc = await adminDb.collection("ebooks").doc(productId).get();
    if (ebookDoc.exists) {
      storagePath = ebookDoc.data()?.storagePath;
      title = ebookDoc.data()?.title;
    } else {
      const hardcoded = HARDCODED_EBOOKS.find((b) => b.id === productId || b.slug === productId);
      if (hardcoded) {
        storagePath = hardcoded.storagePath || hardcoded.pdfUrl;
        title = hardcoded.title;
      }
    }

    if (!storagePath) {
      return NextResponse.json(
        { error: "Download not available" },
        { status: 404 }
      );
    }

    // Generate a time-limited signed URL (supports Cloudinary & Firebase Storage)
    const url = await generateSignedUrl(storagePath, 15, {
      filename: title ? `${title.replace(/[^a-zA-Z0-9_]/g, "_")}.pdf` : undefined,
    });

    return NextResponse.json({ url });
  } catch (error) {
    console.error("Download error:", error);
    return NextResponse.json(
      { error: "Failed to generate download link" },
      { status: 500 }
    );
  }
}
