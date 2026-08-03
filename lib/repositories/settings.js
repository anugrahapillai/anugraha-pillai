import { firestoreSettings } from "@/lib/repositories/firestore-adapters";

export const settingsRepository = {
  async list(options) {
    return firestoreSettings.list(options);
  },
  async listPublic(options) {
    return firestoreSettings.listPublic(options);
  },
  async getById(id) {
    return firestoreSettings.getById(id);
  },
  async create(data) {
    return firestoreSettings.create({ ...data, type: "Setting" });
  },
  async update(id, data) {
    return firestoreSettings.update(id, data);
  },
  async publish(id) {
    return firestoreSettings.publish(id);
  },
  async duplicate(id) {
    return firestoreSettings.duplicate(id);
  },
  async archive(id) {
    return firestoreSettings.archive(id);
  },
};
