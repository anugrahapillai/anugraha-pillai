import "server-only";
import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";

const localMemoryStore = new Map();

function getAdminApp() {
  if (getApps().length > 0) {
    return getApps()[0];
  }

  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || process.env.FIREBASE_PROJECT_ID || "anugraha-pillai";
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

  if (clientEmail && privateKey) {
    return initializeApp({
      credential: cert({ projectId, clientEmail, privateKey }),
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "anugraha-pillai.firebasestorage.app",
    });
  }

  return initializeApp({ projectId });
}

export const adminApp = getAdminApp();
export const adminAuth = getAuth(adminApp);

let dbInstance;
try {
  if (process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY) {
    dbInstance = getFirestore(adminApp);
  } else {
    // Graceful in-memory fallback for local dev when GCP service account JSON key is not provided
    dbInstance = {
      collection: (name) => ({
        doc: (id) => {
          const docId = id || `doc_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
          return {
            id: docId,
            get: async () => {
              const data = localMemoryStore.get(`${name}:${docId}`);
              return { exists: Boolean(data), id: docId, data: () => data };
            },
            set: async (payload) => {
              localMemoryStore.set(`${name}:${docId}`, payload);
              return true;
            },
            update: async (payload) => {
              const existing = localMemoryStore.get(`${name}:${docId}`) || {};
              localMemoryStore.set(`${name}:${docId}`, { ...existing, ...payload });
              return true;
            },
          };
        },
        where: () => ({
          limit: () => ({
            get: async () => {
              const docs = [];
              for (const [key, val] of localMemoryStore.entries()) {
                if (key.startsWith(`${name}:`)) {
                  docs.push({ id: key.split(":")[1], data: () => val });
                }
              }
              return { docs };
            },
          }),
        }),
        limit: () => ({
          get: async () => {
            const docs = [];
            for (const [key, val] of localMemoryStore.entries()) {
              if (key.startsWith(`${name}:`)) {
                docs.push({ id: key.split(":")[1], data: () => val });
              }
            }
            return { docs };
          },
        }),
      }),
      runTransaction: async (cb) => cb({ get: async () => ({ exists: false }), set: () => {} }),
    };
  }
} catch {
  dbInstance = getFirestore(adminApp);
}

export const adminDb = dbInstance;
export const adminStorage = getStorage(adminApp);
