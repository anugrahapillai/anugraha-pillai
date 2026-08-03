import { NextResponse } from "next/server";
import { PHASE_ONE_COOKIE, phaseOneCookieOptions } from "@/lib/server/phase-one-session";

export async function POST() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(PHASE_ONE_COOKIE, "", { ...phaseOneCookieOptions(), maxAge: 0 });
  return response;
}
