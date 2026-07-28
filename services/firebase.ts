const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "dummy-api-key",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "dummy-domain.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "dummy-project",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "dummy-bucket.appspot.com",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

function safeRequire(mod: string) {
  try {
    const req = eval("require");
    return req(mod);
  } catch {
    return null;
  }
}

export function getClientApp() {
  if (!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) return null;
  const fbApp = safeRequire("firebase/app");
  if (!fbApp) return null;
  return fbApp.getApps().length > 0 ? fbApp.getApp() : fbApp.initializeApp(firebaseConfig);
}

export const auth: any = new Proxy({} as any, {
  get(_, prop) {
    const app = getClientApp();
    if (!app) return undefined;
    const fbAuth = safeRequire("firebase/auth");
    if (!fbAuth) return undefined;
    const instance = fbAuth.getAuth(app);
    const value = Reflect.get(instance, prop);
    return typeof value === "function" ? value.bind(instance) : value;
  },
});

export const db: any = new Proxy({} as any, {
  get(_, prop) {
    const app = getClientApp();
    if (!app) return undefined;
    const fbFs = safeRequire("firebase/firestore");
    if (!fbFs) return undefined;
    const instance = fbFs.getFirestore(app);
    const value = Reflect.get(instance, prop);
    return typeof value === "function" ? value.bind(instance) : value;
  },
});

export const storage: any = new Proxy({} as any, {
  get(_, prop) {
    const app = getClientApp();
    if (!app) return undefined;
    const fbStorage = safeRequire("firebase/storage");
    if (!fbStorage) return undefined;
    const instance = fbStorage.getStorage(app);
    const value = Reflect.get(instance, prop);
    return typeof value === "function" ? value.bind(instance) : value;
  },
});

export default getClientApp;
