export const mockContent = [];

export const ADMIN_PAGE_SIZE = 20;

export function displayState(item) {
  if (!item) return "draft";
  return item.status === "published" ? item.deliveryState || "live" : item.status;
}

class MockAdminRepository {
  constructor(initialData = mockContent) {
    this.store = [...initialData];
  }

  async listContent({ type, state, query = "", limit = ADMIN_PAGE_SIZE } = {}) {
    const normalizedQuery = query.trim().toLowerCase();
    const filtered = this.store
      .filter((item) => !type || item.type?.toLowerCase() === type.toLowerCase())
      .filter((item) => !state || displayState(item) === state)
      .filter((item) => !normalizedQuery || (item.title && item.title.toLowerCase().includes(normalizedQuery)));

    return {
      items: filtered.slice(0, Math.min(limit, ADMIN_PAGE_SIZE)),
      total: filtered.length,
      nextCursor: null,
      limit: Math.min(limit, ADMIN_PAGE_SIZE),
    };
  }

  async getById(id) {
    const found = this.store.find((item) => item.id === id);
    return found ? { ...found } : null;
  }

  async create(data) {
    const newItem = {
      id: data.id || `${data.type?.toLowerCase() || "item"}-${Date.now()}`,
      title: data.title || "Untitled",
      type: data.type || "Blog",
      category: data.category || "General",
      status: data.status || "draft",
      deliveryState: data.deliveryState || null,
      publishedAt: data.status === "published" ? "Just now" : "—",
      updatedAt: "Just now",
      slug: data.slug || "untitled",
      body: data.body || "",
      excerpt: data.excerpt || "",
      ...data,
    };
    this.store.unshift(newItem);
    return { ...newItem };
  }

  async update(id, updates) {
    const index = this.store.findIndex((item) => item.id === id);
    if (index === -1) throw new Error(`Item ${id} not found`);
    const updated = {
      ...this.store[index],
      ...updates,
      updatedAt: "Just now",
    };
    this.store[index] = updated;
    return { ...updated };
  }

  async duplicate(id) {
    const target = await this.getById(id);
    if (!target) throw new Error(`Item ${id} not found`);
    const copy = {
      ...target,
      id: `${target.id}-copy-${Date.now()}`,
      title: `${target.title} (copy)`,
      status: "draft",
      deliveryState: null,
      publishedAt: "—",
      updatedAt: "Just now",
    };
    this.store.unshift(copy);
    return { ...copy };
  }

  async archive(id) {
    return this.update(id, { status: "archived", deliveryState: null });
  }

  async dashboard() {
    return {
      needsAction: this.store.filter((item) => ["draft", "pending", "failed"].includes(displayState(item))).slice(0, 5),
      recent: this.store.filter((item) => displayState(item) === "live").slice(0, 5),
    };
  }
}

export const mockAdminRepository = new MockAdminRepository();
