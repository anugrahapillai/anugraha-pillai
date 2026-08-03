import { describe, expect, it } from "vitest";
import { contentDraftSchema, publicationRequestSchema } from "@/lib/validation/content";
import { requireAdmin, requireRecentAuthentication } from "@/lib/server/authorization";

const identity = { uid: "owner-uid", admin: true, email_verified: true, auth_time: 1000 };
const admin = { uid: "owner-uid", active: true };

describe("Phase 2 authorization boundary", () => {
  it("requires both a custom claim and active allow-list record", () => {
    expect(requireAdmin(identity, admin)).toMatchObject({ uid: "owner-uid" });
    expect(() => requireAdmin({ ...identity, admin: false }, admin)).toThrow(/not authorized/i);
    expect(() => requireAdmin(identity, { ...admin, active: false })).toThrow(/not authorized/i);
  });

  it("requires recent authentication for destructive operations", () => {
    expect(() => requireRecentAuthentication(identity, 300, 1200)).not.toThrow();
    expect(() => requireRecentAuthentication(identity, 300, 1400)).toThrow(/recent authentication/i);
  });
});

describe("Phase 2 write contracts", () => {
  it("rejects protected delivery fields in browser draft writes", () => {
    const result = contentDraftSchema.safeParse({
      title: "A valid draft", slug: "a-valid-draft", excerpt: "A useful summary.", body: "Body",
      category: "Notes", tags: [], deliveryState: "live",
    });
    expect(result.success).toBe(false);
  });

  it("requires a stable idempotency key for publication", () => {
    expect(publicationRequestSchema.safeParse({
      contentType: "posts", contentId: "post-1", expectedUpdatedAt: new Date().toISOString(),
      idempotencyKey: "not-a-uuid",
    }).success).toBe(false);
  });
});
