import { NextRequest, NextResponse } from "next/server";
import { adminAuth, isFirebaseAdminConfigured } from "@/services/firebase-admin";
import { getUserPurchases } from "@/services/purchase-service";
import { HARDCODED_EBOOKS } from "@/lib/ebook-data";

export async function GET(request: NextRequest) {
  try {
    // Extract & verify Firebase ID token
    const authHeader = request.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Authentication required. Please sign in." },
        { status: 401 }
      );
    }

    const idToken = authHeader.split("Bearer ")[1];
    let uid: string;

    if (isFirebaseAdminConfigured()) {
      try {
        const decoded = await adminAuth.verifyIdToken(idToken);
        uid = decoded.uid;
      } catch (err) {
        console.warn("Token verification failed:", err);
        return NextResponse.json(
          { error: "Invalid or expired authentication token. Please sign in again." },
          { status: 401 }
        );
      }
    } else {
      // Dev/sandbox mode: extract UID from the token payload (JWT base64)
      try {
        const payloadB64 = idToken.split(".")[1];
        if (!payloadB64) throw new Error("Invalid JWT");
        const payload = JSON.parse(Buffer.from(payloadB64, "base64").toString());
        uid = payload.user_id || payload.sub || payload.uid;
        if (!uid) throw new Error("No UID in token");
      } catch {
        return NextResponse.json(
          { error: "Could not verify identity. Please sign in again." },
          { status: 401 }
        );
      }
    }

    // Get all purchased product IDs for this user
    const purchasedIds = await getUserPurchases(uid);

    // Enrich with product metadata
    const purchases = purchasedIds.map((productId) => {
      const ebook = HARDCODED_EBOOKS.find(
        (b) => b.id === productId || b.slug === productId
      );
      return {
        productId,
        title: ebook?.title ?? productId,
        coverUrl: ebook?.coverUrl ?? "/images/Whispers_of_Grace_Typeset.png",
        slug: ebook?.slug ?? productId,
        pdfUrl: ebook?.pdfUrl ?? null,
      };
    });

    return NextResponse.json({ purchases });
  } catch (error) {
    console.error("Downloads list error:", error);
    return NextResponse.json(
      { error: "Failed to load your downloads" },
      { status: 500 }
    );
  }
}
