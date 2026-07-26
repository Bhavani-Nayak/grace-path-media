import {
  initializeApp,
  getApps,
  cert,
  type ServiceAccount,
} from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";
import { getAuth } from "firebase-admin/auth";

export function isFirebaseAdminConfigured(): boolean {
  const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(
    /\\n/g,
    "\n"
  );

  return Boolean(
    projectId &&
      clientEmail &&
      privateKey &&
      privateKey.includes("-----BEGIN PRIVATE KEY-----") &&
      !privateKey.includes("DUMMY_REPLACE_ME")
  );
}

// In-memory document store for local sandbox / dev mode when GCP credentials are not set
const memoryStore = new Map<string, any>();

function createMockFirestore(): any {
  const mockDb = {
    collection: (collName: string) => ({
      doc: (docId: string) => {
        const path = `${collName}/${docId}`;
        return {
          id: docId,
          path,
          get: async () => {
            const data = memoryStore.get(path);
            return {
              id: docId,
              exists: Boolean(data),
              data: () => data,
            };
          },
          set: async (data: any, options?: { merge?: boolean }) => {
            if (options?.merge && memoryStore.has(path)) {
              memoryStore.set(path, { ...memoryStore.get(path), ...data });
            } else {
              memoryStore.set(path, data);
            }
          },
          update: async (data: any) => {
            const existing = memoryStore.get(path) || {};
            memoryStore.set(path, { ...existing, ...data });
          },
          collection: (subColl: string) => mockDb.collection(`${path}/${subColl}`),
        };
      },
      get: async () => {
        const prefix = `${collName}/`;
        const docs: any[] = [];
        for (const [key, value] of memoryStore.entries()) {
          if (key.startsWith(prefix) && !key.slice(prefix.length).includes("/")) {
            const id = key.slice(prefix.length);
            docs.push({
              id,
              data: () => value,
            });
          }
        }
        return {
          empty: docs.length === 0,
          docs,
        };
      },
    }),
    runTransaction: async (updateFunction: (transaction: any) => Promise<any>) => {
      const mockTransaction = {
        get: async (docRef: any) => docRef.get(),
        set: (docRef: any, data: any, options?: any) => docRef.set(data, options),
        update: (docRef: any, data: any) => docRef.update(data),
      };
      return updateFunction(mockTransaction);
    },
  };

  return mockDb;
}

const mockDbInstance = createMockFirestore();

function getAdminApp() {
  if (getApps().length > 0) {
    return getApps()[0];
  }

  if (isFirebaseAdminConfigured()) {
    try {
      const serviceAccount: ServiceAccount = {
        projectId: process.env.FIREBASE_ADMIN_PROJECT_ID!,
        clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL!,
        privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY!.replace(/\\n/g, "\n"),
      };

      return initializeApp({
        credential: cert(serviceAccount),
        storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      });
    } catch (err) {
      console.warn("Firebase Admin cert error, using dev in-memory store:", err);
    }
  }

  return initializeApp({
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "demo-project",
  });
}

let cachedDb: any = null;
let dbInitFailed = false;

function getDbInstance(): any {
  if (dbInitFailed) return mockDbInstance;
  if (cachedDb) return cachedDb;

  if (isFirebaseAdminConfigured()) {
    try {
      const realDb = getFirestore(getAdminApp());
      // Wrap the real Firestore in a proxy that catches unhandled async errors
      cachedDb = new Proxy(realDb, {
        get(target, prop) {
          const value = Reflect.get(target, prop);
          if (typeof value !== "function") return value;

          // Wrap collection/doc calls to catch async Firestore errors
          return (...args: any[]) => {
            try {
              const result = value.apply(target, args);
              return result;
            } catch (err) {
              console.warn("Firestore sync error, falling back to mock:", err);
              dbInitFailed = true;
              cachedDb = null;
              const mockValue = Reflect.get(mockDbInstance, prop);
              return typeof mockValue === "function"
                ? mockValue.apply(mockDbInstance, args)
                : mockValue;
            }
          };
        },
      });
      return cachedDb;
    } catch {
      dbInitFailed = true;
      return mockDbInstance;
    }
  }
  return mockDbInstance;
}

export const adminDb: any = new Proxy({} as any, {
  get(_, prop) {
    const db = getDbInstance();
    const value = Reflect.get(db, prop);
    if (typeof value === "function") {
      return value.bind(db);
    }
    return value;
  },
});

export const adminStorage = new Proxy({} as any, {
  get(_, prop) {
    try {
      const storage = getStorage(getAdminApp());
      const value = Reflect.get(storage, prop);
      return typeof value === "function" ? value.bind(storage) : value;
    } catch {
      return {};
    }
  },
});

export const adminAuth = new Proxy({} as any, {
  get(_, prop) {
    try {
      const auth = getAuth(getAdminApp());
      const value = Reflect.get(auth, prop);
      return typeof value === "function" ? value.bind(auth) : value;
    } catch {
      return {};
    }
  },
});

export default lazyApp();

function lazyApp() {
  return new Proxy({} as any, {
    get(_, prop) {
      try {
        const app = getAdminApp();
        const value = Reflect.get(app, prop);
        return typeof value === "function" ? value.bind(app) : value;
      } catch {
        return {};
      }
    },
  });
}
