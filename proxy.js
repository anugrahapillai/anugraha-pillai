import { NextResponse } from "next/server";
import { PHASE_ONE_COOKIE, verifyPhaseOneSession } from "@/lib/server/phase-one-session";

export async function proxy(request) {
  const pathname = request.nextUrl.pathname;

  // Allow public content listing GET API requests
  if (pathname === "/api/admin/content" && request.method === "GET") {
    return NextResponse.next();
  }

  // Allow login page access without session check
  if (pathname === "/admin/login") {
    return NextResponse.next();
  }

  const session = await verifyPhaseOneSession(request.cookies.get(PHASE_ONE_COOKIE)?.value);

  if (session) {
    return NextResponse.next();
  }

  // API protection: return 401 JSON instead of redirecting
  if (pathname.startsWith("/api/")) {
    return NextResponse.json(
      { error: "Unauthorized access. Admin session is invalid or expired." },
      { status: 401 }
    );
  }

  // UI page protection: redirect to login
  const loginUrl = new URL("/admin/login", request.url);
  loginUrl.searchParams.set("reason", "session");
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
