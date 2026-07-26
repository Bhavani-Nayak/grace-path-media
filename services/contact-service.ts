import { collection, addDoc, serverTimestamp, getFirestore } from "firebase/firestore";
import { getApps, initializeApp, getApp } from "firebase/app";

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
  slug?: string;
}

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "dummy-api-key",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "dummy-domain.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "dummy-project",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "dummy-bucket.appspot.com",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

function getDbInstance() {
  try {
    const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    return getFirestore(app);
  } catch {
    return null;
  }
}

export async function submitContactForm(data: ContactFormData): Promise<void> {
  try {
    const firestoreDb = getDbInstance();
    if (firestoreDb && process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) {
      await addDoc(collection(firestoreDb, "contact-submissions"), {
        ...data,
        slug: data.slug || "general-enquiry",
        createdAt: serverTimestamp(),
        status: "new",
      });
    } else {
      console.log("[Grace Path Media] Contact Submission Received:", data);
    }
  } catch (error) {
    console.warn("[Grace Path Media] Contact Form stored fallback:", error);
  }
}


