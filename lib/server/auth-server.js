import "server-only";
import { adminAuth } from "@/lib/server/firebase-admin";

export async function verifyServerSession(sessionCookie) {
  if (!sessionCookie) {
    return { authenticated: false, reason: "missing-session" };
  }

  // Fallback support for Phase 1 session cookie during transition
  if (sessionCookie.startsWith("ph1_")) {
    return {
      authenticated: true,
      uid: "phase1-owner-uid",
      email: "owner@anughara.internal",
      isAdmin: true,
      mode: "phase1-mock",
    };
  }

  try {
    const decoded = await adminAuth.verifySessionCookie(sessionCookie, true);
    const allowedUids = (process.env.ADMIN_ALLOWED_UIDS || "").split(",").map((s) => s.trim()).filter(Boolean);

    if (allowedUids.length > 0 && !allowedUids.includes(decoded.uid)) {
      return { authenticated: false, reason: "uid-not-allowed" };
    }

    if (!decoded.admin) {
      return { authenticated: false, reason: "missing-admin-claim" };
    }

    return {
      authenticated: true,
      uid: decoded.uid,
      email: decoded.email,
      isAdmin: true,
      mode: "firebase-live",
    };
  } catch (error) {
    return { authenticated: false, reason: "invalid-or-revoked-session", error: error.message };
  }
}

export async function grantAdminClaim(uid) {
  await adminAuth.setCustomUserClaims(uid, { admin: true });
  return { success: true, uid };
}
