import { describe, expect, it } from "vitest";
import { blogDraftSchema, normalizeSlug } from "@/lib/validation/content";
import { ADMIN_PAGE_SIZE, displayState, mockAdminRepository } from "@/lib/repositories/mock-admin";

describe("Phase 1 content contracts", () => {
  it("normalizes an editor title into the documented slug format", () => {
    expect(normalizeSlug("  Signals & Systems: A Field Note  ")).toBe("signals-systems-a-field-note");
  });

  it("rejects malformed drafts before an adapter receives them", () => {
    const result = blogDraftSchema.safeParse({ title: "No", slug: "Not Valid", excerpt: "short" });
    expect(result.success).toBe(false);
  });

  it("accepts a complete mock blog draft", () => {
    const result = blogDraftSchema.safeParse({
      title: "A clear and useful title", slug: "a-clear-and-useful-title",
      excerpt: "A sufficiently detailed editorial summary.", body: "Structured body block",
      category: "Analysis", tags: ["systems"], coverAlt: "", seoTitle: "", seoDescription: "",
    });
    expect(result.success).toBe(true);
  });
});

describe("mock repository boundary", () => {
  it("keeps editorial status separate from publication delivery", () => {
    expect(displayState({ status: "published", deliveryState: "failed" })).toBe("failed");
    expect(displayState({ status: "archived", deliveryState: null })).toBe("archived");
  });

  it("uses a bounded page-size contract", async () => {
    const result = await mockAdminRepository.listContent();
    expect(result.limit).toBe(ADMIN_PAGE_SIZE);
    expect(result.items.length).toBeLessThanOrEqual(ADMIN_PAGE_SIZE);
  });

  it("filters only the currently loaded mock view", async () => {
    await mockAdminRepository.create({
      id: "post-102",
      title: "Composite material fatigue in high-stress airframes",
      type: "Blog",
      category: "Structures",
      status: "draft",
      deliveryState: null,
    });
    const result = await mockAdminRepository.listContent({ type: "Blog", state: "draft", query: "composite" });
    expect(result.items.length).toBeGreaterThan(0);
    expect(result.items[0].id).toBe("post-102");
  });

  it("bounds dashboard sections rather than calculating collection totals", async () => {
    const dashboard = await mockAdminRepository.dashboard();
    expect(dashboard.needsAction.length).toBeLessThanOrEqual(5);
    expect(dashboard.recent.length).toBeLessThanOrEqual(5);
  });
});
