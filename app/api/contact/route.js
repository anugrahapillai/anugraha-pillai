import { NextResponse } from "next/server";
import { contactSchema } from "@/lib/validation/common";
import { sendContactEmail, TARGET_TEST_EMAIL } from "@/lib/server/mail-service";

export async function POST(request) {
  try {
    const body = await request.json();

    // Honeypot bot trap
    if (body.hp) {
      return NextResponse.json({ success: true, note: "Filtered" }, { status: 200 });
    }

    const validated = contactSchema.parse(body);

    const dispatchResult = await sendContactEmail(validated);

    return NextResponse.json({
      success: true,
      message: "Your message has been successfully received and saved.",
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid contact submission", details: error.errors || error.message },
      { status: 400 }
    );
  }
}
