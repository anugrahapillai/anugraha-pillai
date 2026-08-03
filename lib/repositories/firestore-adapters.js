import { db } from "@/lib/client/firebase-client";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  deleteDoc,
  query,
  where,
  limit as limitConstraint,
} from "firebase/firestore";

export class FirestoreRepository {
  constructor(collectionName) {
    this.collectionName = collectionName;
  }

  get collectionRef() {
    return collection(db, this.collectionName);
  }

  async list({ state, queryStr, limit = 50 } = {}) {
    try {
      let q = query(this.collectionRef, limitConstraint(limit));
      if (state) {
        q = query(this.collectionRef, where("status", "==", state), limitConstraint(limit));
      }
      const snapshot = await getDocs(q);
      let items = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));

      if (queryStr) {
        const search = queryStr.toLowerCase();
        items = items.filter(
          (item) =>
            (item.title && item.title.toLowerCase().includes(search)) ||
            (item.excerpt && item.excerpt.toLowerCase().includes(search)) ||
            (item.category && item.category.toLowerCase().includes(search))
        );
      }

      return { items, total: items.length };
    } catch (error) {
      console.warn(`Firestore list fallback for ${this.collectionName}:`, error.message);
      return { items: [], total: 0, error: error.message };
    }
  }

  async listPublic({ limit = 50 } = {}) {
    try {
      const q = query(
        this.collectionRef,
        where("status", "==", "published"),
        limitConstraint(limit)
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
    } catch (error) {
      console.warn(`Firestore listPublic fallback for ${this.collectionName}:`, error.message);
      return [];
    }
  }

  async getById(id) {
    try {
      const docRef = doc(db, this.collectionName, id);
      const snap = await getDoc(docRef);
      if (!snap.exists()) return null;
      return { id: snap.id, ...snap.data() };
    } catch (error) {
      console.warn(`Firestore getById fallback for ${id}:`, error.message);
      return null;
    }
  }

  async create(data) {
    const docRef = data.id
      ? doc(db, this.collectionName, data.id)
      : doc(collection(db, this.collectionName));

    const payload = {
      ...data,
      id: docRef.id,
      status: data.status || "draft",
      deliveryState: data.deliveryState || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      publishedAt: data.status === "published" ? new Date().toISOString() : "—",
    };

    try {
      await setDoc(docRef, payload, { merge: true });
      return { id: docRef.id, ...payload };
    } catch (error) {
      if (error.message.includes("permission") || error.code === "permission-denied" || error.code === 7) {
        throw new Error("Firestore permission denied. Update Security Rules in Firebase Console to allow write operations.");
      }
      throw error;
    }
  }

  async update(id, data) {
    const docRef = doc(db, this.collectionName, id);
    const payload = {
      ...data,
      updatedAt: new Date().toISOString(),
    };
    try {
      await setDoc(docRef, payload, { merge: true });
      return this.getById(id);
    } catch (error) {
      if (error.message.includes("permission") || error.code === "permission-denied" || error.code === 7) {
        throw new Error("Firestore permission denied. Update Security Rules in Firebase Console to allow write operations.");
      }
      throw error;
    }
  }

  async publish(id) {
    return this.update(id, {
      status: "published",
      deliveryState: "live",
      publishedAt: new Date().toISOString(),
    });
  }

  async duplicate(id) {
    const original = await this.getById(id);
    if (!original) throw new Error(`Item ${id} not found`);
    const { id: _oldId, ...rest } = original;
    const copyData = {
      ...rest,
      title: `${rest.title || "Untitled"} (copy)`,
      status: "draft",
      deliveryState: null,
      publishedAt: "—",
    };
    return this.create(copyData);
  }

  async delete(id) {
    try {
      const docRef = doc(db, this.collectionName, id);
      await deleteDoc(docRef);
      return { success: true, id };
    } catch (error) {
      if (error.message.includes("permission") || error.code === "permission-denied" || error.code === 7) {
        throw new Error("Firestore permission denied. Update Security Rules in Firebase Console to allow delete operations.");
      }
      throw error;
    }
  }

  async archive(id) {
    return this.update(id, { status: "archived", deliveryState: null });
  }

  async reserveSlug(slug, entityType) {
    try {
      const docRef = doc(db, "slugReservations", `${entityType}:${slug}`);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        throw new Error(`Slug ${slug} is already reserved for ${entityType}`);
      }
      await setDoc(docRef, {
        slug,
        entityType,
        reservedAt: new Date().toISOString(),
      });
      return { success: true, slug, entityType };
    } catch (error) {
      if (error.message.includes("permission") || error.code === "permission-denied" || error.code === 7) {
        throw new Error("Firestore permission denied. Update Security Rules in Firebase Console to allow write operations.");
      }
      throw error;
    }
  }
}

export const firestorePosts = new FirestoreRepository("posts");
export const firestorePosters = new FirestoreRepository("posters");
export const firestoreResearch = new FirestoreRepository("research");
export const firestoreServices = new FirestoreRepository("services");
export const firestorePages = new FirestoreRepository("pages");
export const firestoreSettings = new FirestoreRepository("settings");
