import { NextRequest, NextResponse } from "next/server";
import { HARDCODED_EBOOKS } from "@/lib/ebook-data";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const ebookId = searchParams.get("ebookId");

    if (!ebookId) {
      return NextResponse.json(
        { error: "eBook ID or slug is required" },
        { status: 400 }
      );
    }

    const matchedEbook = HARDCODED_EBOOKS.find(
      (b) => b.id === ebookId || b.slug === ebookId
    );

    if (!matchedEbook) {
      return NextResponse.json(
        { error: "eBook not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      owned: true,
      ebookId: matchedEbook.id,
      title: matchedEbook.title,
      downloadUrl: matchedEbook.pdfUrl,
      coverUrl: matchedEbook.coverUrl,
      storageProvider: "local",
    });
  } catch (error) {
    console.error("Download verification error:", error);
    return NextResponse.json(
      { error: "Failed to verify eBook ownership" },
      { status: 500 }
    );
  }
}

