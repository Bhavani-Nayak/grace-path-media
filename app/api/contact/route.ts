import { NextResponse } from "next/server";
import { z } from "zod";
import { checkRateLimit, getRateLimitKey } from "@/lib/rate-limit";
import { adminDb } from "@/services/firebase-admin";

const bodySchema = z.object({
  name: z.string().min(1).max(200),
  email: z.string().email(),
  subject: z.string().min(1).max(300),
  message: z.string().min(1).max(5000),
});

export async function POST(request: Request) {
  try {
    // Rate limit
    const key = getRateLimitKey(request, "contact");
    const { allowed } = checkRateLimit(key);
    if (!allowed) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    const rawBody = await request.json();
    const parsed = bodySchema.safeParse(rawBody);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    await adminDb.collection("contact-submissions").add({
      ...parsed.data,
      createdAt: new Date(),
      status: "new",
    });

    // TODO: send email notification to CONTACT_EMAIL using transactional email service
    console.log("Contact form submission received:", parsed.data.email);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Failed to send message. Please try again." },
      { status: 500 }
    );
  }
}
