import { describe, expect, it } from "vitest";
import { mockAdminRepository } from "@/lib/repositories/mock-admin";
import { postsRepository } from "@/lib/repositories/posts";
import { postersRepository } from "@/lib/repositories/posters";
import { researchRepository } from "@/lib/repositories/research";
import { servicesRepository } from "@/lib/repositories/services";
import { pagesRepository } from "@/lib/repositories/pages";
import { settingsRepository } from "@/lib/repositories/settings";

describe("Phase 1 Repositories", () => {
  it("filters items by type correctly", async () => {
    const blogs = await postsRepository.list();
    expect(blogs.items.length).toBeGreaterThan(0);
    expect(blogs.items.every((i) => i.type === "Blog")).toBe(true);

    const posters = await postersRepository.list();
    expect(posters.items.length).toBeGreaterThan(0);
    expect(posters.items.every((i) => i.type === "Poster")).toBe(true);
  });

  it("supports creation, fetching, duplication, and archival", async () => {
    const newPost = await postsRepository.create({
      title: "Test New Policy Post",
      category: "Policy",
      slug: "test-new-policy-post",
    });
    expect(newPost.id).toBeDefined();
    expect(newPost.title).toBe("Test New Policy Post");

    const fetched = await postsRepository.getById(newPost.id);
    expect(fetched).toBeDefined();
    expect(fetched.title).toBe("Test New Policy Post");

    const copy = await postsRepository.duplicate(newPost.id);
    expect(copy.title).toBe("Test New Policy Post (copy)");
    expect(copy.status).toBe("draft");

    const archived = await postsRepository.archive(newPost.id);
    expect(archived.status).toBe("archived");
  });

  it("supports dashboard needsAction and recent queries", async () => {
    const dash = await mockAdminRepository.dashboard();
    expect(dash.needsAction).toBeDefined();
    expect(dash.recent).toBeDefined();
    expect(Array.isArray(dash.needsAction)).toBe(true);
    expect(Array.isArray(dash.recent)).toBe(true);
  });

  it("handles empty query results gracefully", async () => {
    const result = await mockAdminRepository.listContent({ query: "nonexistent-query-string-xyz" });
    expect(result.items).toHaveLength(0);
    expect(result.total).toBe(0);
  });
});
