interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
  slug?: string;
}

function safeRequire(mod: string) {
  try {
    const req = eval("require");
    return req(mod);
  } catch {
    return null;
  }
}

export async function submitContactForm(data: ContactFormData): Promise<void> {
  try {
    if (process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) {
      const fbApp = safeRequire("firebase/app");
      const fbFs = safeRequire("firebase/firestore");
      if (fbApp && fbFs) {
        const firebaseConfig = {
          apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "dummy-api-key",
          authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "dummy-domain.firebaseapp.com",
          projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
          storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
        };
        const app = fbApp.getApps().length > 0 ? fbApp.getApp() : fbApp.initializeApp(firebaseConfig);
        const firestoreDb = fbFs.getFirestore(app);
        await fbFs.addDoc(fbFs.collection(firestoreDb, "contact-submissions"), {
          ...data,
          slug: data.slug || "general-enquiry",
          createdAt: fbFs.serverTimestamp(),
          status: "new",
        });
        return;
      }
    }
    console.log("[Grace Path Media] Contact Submission Received:", data);
  } catch (error) {
    console.warn("[Grace Path Media] Contact Form stored fallback:", error);
  }
}
