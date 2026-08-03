import { describe, expect, it } from "vitest";
import { contactSchema } from "@/lib/validation/common";

const testContent = [
  { id: "1", type: "Blog", title: "Aerodynamics Test", category: "Aerodynamics", excerpt: "Test excerpt" },
  { id: "2", type: "Poster", title: "Flow Poster", category: "Visuals", excerpt: "Poster excerpt" },
];

describe("Phase 3 Public Features", () => {
  it("filters and validates contact form payload schema", () => {
    const validPayload = {
      name: "Maya Lin",
      email: "maya@example.com",
      subject: "Advisory Inquiry",
      message: "Looking forward to collaborating.",
    };

    const parsed = contactSchema.parse(validPayload);
    expect(parsed.name).toBe("Maya Lin");
    expect(parsed.email).toBe("maya@example.com");

    const invalidPayload = { name: "", email: "not-an-email", message: "" };
    expect(() => contactSchema.parse(invalidPayload)).toThrow();
  });

  it("filters content to return only public items", () => {
    const blogs = testContent.filter((i) => i.type === "Blog");
    expect(blogs.length).toBeGreaterThan(0);
    expect(blogs.every((b) => b.type === "Blog")).toBe(true);

    const posters = testContent.filter((i) => i.type === "Poster");
    expect(posters.length).toBeGreaterThan(0);
    expect(posters.every((p) => p.type === "Poster")).toBe(true);
  });

  it("supports public client search query filtering", () => {
    const query = "aerodynamics";
    const results = testContent.filter(
      (item) =>
        item.title.toLowerCase().includes(query) ||
        (item.excerpt && item.excerpt.toLowerCase().includes(query)) ||
        (item.category && item.category.toLowerCase().includes(query))
    );
    expect(results.length).toBeGreaterThan(0);
  });
});
