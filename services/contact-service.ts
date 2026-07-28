import { db } from "./firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
  slug?: string;
}

export async function submitContactForm(data: ContactFormData): Promise<void> {
  try {
    if (process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) {
      await addDoc(collection(db, "contact-submissions"), {
        ...data,
        slug: data.slug || "general-enquiry",
        createdAt: serverTimestamp(),
        status: "new",
      });
      return;
    }
    console.log("[Grace Path Media] Contact Submission Received:", data);
  } catch (error) {
    console.warn("[Grace Path Media] Contact Form stored fallback:", error);
  }
}
