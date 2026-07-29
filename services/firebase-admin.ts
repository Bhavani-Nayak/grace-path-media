export function isFirebaseAdminConfigured(): boolean {
  return false;
}

// In-memory document store for local static sandbox mode
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

export const adminDb: any = mockDbInstance;
export const adminStorage: any = {};
export const adminAuth: any = {};

export default mockDbInstance;

