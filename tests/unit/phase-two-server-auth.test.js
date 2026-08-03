import { describe, expect, it } from "vitest";
import { verifyServerSession } from "@/lib/server/auth-server";

describe("Phase 2 Server Auth & Sessions", () => {
  it("rejects missing session cookies", async () => {
    const result = await verifyServerSession(null);
    expect(result.authenticated).toBe(false);
    expect(result.reason).toBe("missing-session");
  });

  it("handles phase 1 mock session cookie fallback", async () => {
    const result = await verifyServerSession("ph1_mock_session_token");
    expect(result.authenticated).toBe(true);
    expect(result.isAdmin).toBe(true);
    expect(result.mode).toBe("phase1-mock");
  });

  it("rejects invalid session cookies safely", async () => {
    const result = await verifyServerSession("invalid_session_cookie_token");
    expect(result.authenticated).toBe(false);
    expect(result.reason).toBe("invalid-or-revoked-session");
  });
});
