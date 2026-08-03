import { firestorePosts } from "@/lib/repositories/firestore-adapters";

export const postsRepository = {
  async list(options) {
    return firestorePosts.list(options);
  },
  async listPublic(options) {
    return firestorePosts.listPublic(options);
  },
  async getById(id) {
    return firestorePosts.getById(id);
  },
  async create(data) {
    return firestorePosts.create({ ...data, type: "Blog" });
  },
  async update(id, data) {
    return firestorePosts.update(id, data);
  },
  async publish(id) {
    return firestorePosts.publish(id);
  },
  async duplicate(id) {
    return firestorePosts.duplicate(id);
  },
  async archive(id) {
    return firestorePosts.archive(id);
  },
};
