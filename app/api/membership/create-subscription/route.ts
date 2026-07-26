import { NextResponse } from "next/server";
import { z } from "zod";
import { createPayPalSubscription } from "@/services/paypal-service";

const bodySchema = z.object({
  planId: z.string().min(1, "planId is required"),
});

export async function POST(request: Request) {
  try {
    const rawBody = await request.json();
    const parsed = bodySchema.safeParse(rawBody);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const { planId } = parsed.data;
    const origin = request.headers.get("origin") ?? "http://localhost:3000";

    const result = await createPayPalSubscription(
      planId,
      `${origin}/membership?subscribed=true`,
      `${origin}/membership?cancelled=true`
    );

    return NextResponse.json({
      subscriptionId: result.subscriptionId,
      approvalUrl: result.approvalUrl,
    });
  } catch (error) {
    console.error("Create subscription error:", error);
    return NextResponse.json(
      { error: "Failed to create subscription. Please try again." },
      { status: 500 }
    );
  }
}
