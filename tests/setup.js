import "@testing-library/jest-dom/vitest";
import { vi } from "vitest";

vi.mock("server-only", () => ({}));

const mockDocStore = new Map();

vi.mock("firebase/firestore", () => {
  return {
    getFirestore: vi.fn(() => ({})),
    collection: vi.fn((db, name) => ({ name: typeof db === "string" ? db : name })),
    doc: vi.fn((...args) => {
      let collName = "posts";
      let docId = `doc_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
      if (args.length >= 3) {
        collName = args[1];
        docId = args[2] || docId;
      } else if (args.length === 2) {
        collName = typeof args[0] === "string" ? args[0] : args[0].name || "posts";
        docId = args[1] || docId;
      } else if (args.length === 1) {
        collName = typeof args[0] === "string" ? args[0] : args[0].name || "posts";
      }
      return { id: docId, name: collName };
    }),
    getDoc: vi.fn(async (docRef) => {
      const data = mockDocStore.get(`${docRef.name}:${docRef.id}`);
      return {
        exists: () => Boolean(data),
        id: docRef.id,
        data: () => data,
      };
    }),
    getDocs: vi.fn(async (q) => {
      const collName = q.collName || q.name || "posts";
      const docs = [];
      for (const [key, val] of mockDocStore.entries()) {
        if (key.startsWith(`${collName}:`)) {
          docs.push({ id: key.split(":")[1], data: () => val });
        }
      }
      if (docs.length === 0) {
        const sampleId = `${collName}-101`;
        const sampleData = { id: sampleId, title: `Sample ${collName}`, type: collName === "posts" ? "Blog" : "Poster", status: "published", deliveryState: "live" };
        return { docs: [{ id: sampleId, data: () => sampleData }] };
      }
      return { docs };
    }),
    setDoc: vi.fn(async (docRef, payload) => {
      mockDocStore.set(`${docRef.name}:${docRef.id}`, payload);
      return true;
    }),
    updateDoc: vi.fn(async (docRef, payload) => {
      const existing = mockDocStore.get(`${docRef.name}:${docRef.id}`) || {};
      mockDocStore.set(`${docRef.name}:${docRef.id}`, { ...existing, ...payload });
      return true;
    }),
    query: vi.fn((coll) => ({ collName: coll.name, ...coll })),
    where: vi.fn(() => ({})),
    limit: vi.fn(() => ({})),
  };
});

vi.mock("@/lib/server/firebase-admin", () => {
  return {
    adminApp: {},
    adminAuth: {
      verifySessionCookie: vi.fn(),
      setCustomUserClaims: vi.fn(),
    },
    adminDb: {
      collection: (name) => ({
        doc: (id) => {
          const docId = id || `doc_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
          return {
            id: docId,
            get: async () => {
              const data = mockDocStore.get(`${name}:${docId}`);
              return {
                exists: Boolean(data),
                id: docId,
                data: () => data,
              };
            },
            set: async (payload) => {
              mockDocStore.set(`${name}:${docId}`, payload);
              return true;
            },
            update: async (payload) => {
              const existing = mockDocStore.get(`${name}:${docId}`) || {};
              mockDocStore.set(`${name}:${docId}`, { ...existing, ...payload });
              return true;
            },
          };
        },
        where: () => ({
          limit: () => ({
            get: async () => {
              const docs = [];
              for (const [key, val] of mockDocStore.entries()) {
                if (key.startsWith(`${name}:`)) {
                  const docId = key.split(":")[1];
                  docs.push({ id: docId, data: () => val });
                }
              }
              if (docs.length === 0) {
                const sampleId = `${name}-101`;
                const sampleData = { id: sampleId, title: `Sample ${name}`, type: name === "posts" ? "Blog" : "Poster", status: "published", deliveryState: "live" };
                return { docs: [{ id: sampleId, data: () => sampleData }] };
              }
              return { docs };
            },
          }),
        }),
        limit: () => ({
          get: async () => {
            const docs = [];
            for (const [key, val] of mockDocStore.entries()) {
              if (key.startsWith(`${name}:`)) {
                const docId = key.split(":")[1];
                docs.push({ id: docId, data: () => val });
              }
            }
            if (docs.length === 0) {
              const sampleId = `${name}-101`;
              const sampleData = { id: sampleId, title: `Sample ${name}`, type: name === "posts" ? "Blog" : "Poster", status: "published", deliveryState: "live" };
              return { docs: [{ id: sampleId, data: () => sampleData }] };
            }
            return { docs };
          },
        }),
      }),
      runTransaction: async (cb) => cb({ get: async () => ({ exists: false }), set: vi.fn() }),
    },
    adminStorage: {},
  };
});
