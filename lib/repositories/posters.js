import { firestorePosters } from "@/lib/repositories/firestore-adapters";

export const postersRepository = {
  async list(options) {
    return firestorePosters.list(options);
  },
  async listPublic(options) {
    return firestorePosters.listPublic(options);
  },
  async getById(id) {
    return firestorePosters.getById(id);
  },
  async create(data) {
    return firestorePosters.create({ ...data, type: "Poster" });
  },
  async update(id, data) {
    return firestorePosters.update(id, data);
  },
  async publish(id) {
    return firestorePosters.publish(id);
  },
  async duplicate(id) {
    return firestorePosters.duplicate(id);
  },
  async archive(id) {
    return firestorePosters.archive(id);
  },
};
