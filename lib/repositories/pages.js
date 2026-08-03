import { firestorePages } from "@/lib/repositories/firestore-adapters";

export const pagesRepository = {
  async list(options) {
    return firestorePages.list(options);
  },
  async listPublic(options) {
    return firestorePages.listPublic(options);
  },
  async getById(id) {
    return firestorePages.getById(id);
  },
  async create(data) {
    return firestorePages.create({ ...data, type: "Page" });
  },
  async update(id, data) {
    return firestorePages.update(id, data);
  },
  async publish(id) {
    return firestorePages.publish(id);
  },
  async duplicate(id) {
    return firestorePages.duplicate(id);
  },
  async archive(id) {
    return firestorePages.archive(id);
  },
};
