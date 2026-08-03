import { NextResponse } from "next/server";
import { z } from "zod";
import { firestorePosts } from "@/lib/repositories/firestore-adapters";

const schema = z.object({
  email: z.string().email().max(254),
}).strict();


export async function POST(request) {
  try {
    const body = await request.json().catch(() => null);
    const parsed = schema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
    }

    const emailLower = parsed.data.email.toLowerCase().trim();
    const isAuthorized = AUTHORIZED_ADMIN_EMAILS.has(emailLower);

    if (isAuthorized) {
      const resetToken = Math.random().toString(36).substring(2, 10);
      const timestamp = new Date().toISOString();

      // Record reset request in Cloud Firestore `passwordResets`
      try {
        await firestorePosts.create.call(
          { collectionName: "passwordResets" },
          {
            email: emailLower,
            resetToken,
            requestedAt: timestamp,
            status: "pending",
          }
        ).catch(() => null);
      } catch (err) {
        console.warn("Firestore password reset logging warning:", err.message);
      }
    }

    return NextResponse.json({
      success: true,
      message: "If an approved admin account matches that email address, password reset instructions have been logged.",
    });
  } catch (error) {
    return NextResponse.json({ error: error.message || "Unable to process password reset request." }, { status: 500 });
  }
}
