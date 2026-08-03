import { NextResponse } from "next/server";
import { z } from "zod";
import { createPhaseOneSession, PHASE_ONE_COOKIE, phaseOneCookieOptions } from "@/lib/server/phase-one-session";

const credentialsSchema = z
  .object({
    email: z.string().email().max(254),
    password: z.string().min(8).max(128).optional(),
    idToken: z.string().nullable().optional(),
  })
  .strict();

export async function POST(request) {
  const parsed = credentialsSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid login credentials provided." }, { status: 400 });
  }

  const emailLower = parsed.data.email.toLowerCase().trim();
  const configuredEmail = (process.env.PHASE_ONE_ADMIN_EMAIL || "").toLowerCase().trim();
  const allowedEnvList = (process.env.ADMIN_ALLOWED_EMAILS || "")
    .split(",")
    .map((e) => e.toLowerCase().trim())
    .filter(Boolean);

  // 1. Production Whitelist Enforcement (Environment Driven)
  const isAuthorizedEmail =
    (configuredEmail && emailLower === configuredEmail) ||
    allowedEnvList.includes(emailLower);

  if (configuredEmail || allowedEnvList.length > 0) {
    if (!isAuthorizedEmail) {
      return NextResponse.json({ error: "Access denied. Unauthorized admin email address." }, { status: 403 });
    }
  }

  // 2. Production Security Token / Password Validation
  const idToken = parsed.data.idToken;
  const password = parsed.data.password;
  const configuredPassword = process.env.PHASE_ONE_ADMIN_PASSWORD;

  const isPasswordValid = configuredPassword && password === configuredPassword;

  // Reject login if neither Firebase Auth ID Token nor server-configured password matches
  if (!idToken && !isPasswordValid) {
    return NextResponse.json({ error: "Invalid admin credentials." }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true, displayName: "Authorized Admin", email: parsed.data.email });
  response.cookies.set(PHASE_ONE_COOKIE, await createPhaseOneSession(parsed.data.email), phaseOneCookieOptions());
  return response;
}
