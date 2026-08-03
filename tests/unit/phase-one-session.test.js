import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { createPhaseOneSession, verifyPhaseOneSession } from "@/lib/server/phase-one-session";

describe("Phase 1 signed session boundary", () => {
  beforeEach(() => { process.env.PHASE_ONE_SESSION_SECRET = "test-only-session-secret-at-least-32-characters"; });
  afterEach(() => { delete process.env.PHASE_ONE_SESSION_SECRET; });

  it("accepts an authentic unexpired token", async () => {
    const token = await createPhaseOneSession("owner@example.test");
    await expect(verifyPhaseOneSession(token)).resolves.toMatchObject({ email: "owner@example.test" });
  });

  it("rejects a browser-tampered token", async () => {
    const token = await createPhaseOneSession("owner@example.test");
    await expect(verifyPhaseOneSession(`${token.slice(0, -1)}x`)).resolves.toBeNull();
  });
});
