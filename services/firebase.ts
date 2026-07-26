import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "dummy-api-key",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "dummy-domain.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "dummy-project",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "dummy-bucket.appspot.com",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

function lazy<T extends object>(initializer: () => T): T {
  let target: T | null = null;
  return new Proxy({} as T, {
    get(_, prop) {
      if (!target) {
        target = initializer();
      }
      const value = Reflect.get(target, prop);
      if (typeof value === "function") {
        return value.bind(target);
      }
      return value;
    },
  });
}

const getClientApp = () => {
  return getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
};

export const auth = lazy(() => getAuth(getClientApp()));
export const db = lazy(() => getFirestore(getClientApp()));
export const storage = lazy(() => getStorage(getClientApp()));
export default lazy(() => getClientApp());
