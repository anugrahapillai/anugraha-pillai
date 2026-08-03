import { firestoreResearch } from "@/lib/repositories/firestore-adapters";

export const researchRepository = {
  async list(options) {
    return firestoreResearch.list(options);
  },
  async listPublic(options) {
    return firestoreResearch.listPublic(options);
  },
  async getById(id) {
    return firestoreResearch.getById(id);
  },
  async create(data) {
    return firestoreResearch.create({ ...data, type: "Research" });
  },
  async update(id, data) {
    return firestoreResearch.update(id, data);
  },
  async publish(id) {
    return firestoreResearch.publish(id);
  },
  async duplicate(id) {
    return firestoreResearch.duplicate(id);
  },
  async archive(id) {
    return firestoreResearch.archive(id);
  },
};
