import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  return NextResponse.json(
    { message: "Cloudinary downloads disabled for static site mode.", isConfigured: false },
    { status: 200 }
  );
}

