import { firestoreServices } from "@/lib/repositories/firestore-adapters";

export const servicesRepository = {
  async list(options) {
    return firestoreServices.list(options);
  },
  async listPublic(options) {
    return firestoreServices.listPublic(options);
  },
  async getById(id) {
    return firestoreServices.getById(id);
  },
  async create(data) {
    return firestoreServices.create({ ...data, type: "Service" });
  },
  async update(id, data) {
    return firestoreServices.update(id, data);
  },
  async publish(id) {
    return firestoreServices.publish(id);
  },
  async duplicate(id) {
    return firestoreServices.duplicate(id);
  },
  async archive(id) {
    return firestoreServices.archive(id);
  },
};
