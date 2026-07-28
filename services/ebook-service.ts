import type { Ebook } from "@/models/ebook";
import { HARDCODED_EBOOKS, ExtendedEbook } from "@/lib/ebook-data";

const EBOOKS_COLLECTION = "ebooks";

function safeRequire(mod: string) {
  try {
    const req = eval("require");
    return req(mod);
  } catch {
    return null;
  }
}

export async function getEbooks(): Promise<ExtendedEbook[]> {
  try {
    if (!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) {
      return HARDCODED_EBOOKS;
    }
    const { db } = safeRequire("./firebase") || {};
    const fbFs = safeRequire("firebase/firestore");
    if (!db || !fbFs) return HARDCODED_EBOOKS;

    const q = fbFs.query(
      fbFs.collection(db, EBOOKS_COLLECTION),
      fbFs.orderBy("createdAt", "desc")
    );
    const snapshot = await fbFs.getDocs(q);
    if (snapshot.empty) {
      return HARDCODED_EBOOKS;
    }
    return snapshot.docs.map((docSnap: any) => {
      const data = docSnap.data();
      const fallback = HARDCODED_EBOOKS.find((b) => b.slug === data.slug || b.id === docSnap.id);
      return {
        id: docSnap.id,
        slug: data.slug as string,
        title: data.title as string,
        author: data.author as string,
        description: data.description as string,
        shortDescription: data.shortDescription as string,
        price: data.price as number,
        coverUrl: (data.coverUrl as string) || fallback?.coverUrl || "/images/ebook-cover-placeholder-1.svg",
        pdfUrl: fallback?.pdfUrl || `/images/${data.slug}.pdf`,
        storagePath: (data.storagePath as string) || fallback?.storagePath || "",
        tags: data.tags as string[],
        pageCount: data.pageCount as number,
        readingTime: data.readingTime as string,
        createdAt: (data.createdAt as { toDate?: () => Date })?.toDate?.() ?? new Date(),
        updatedAt: (data.updatedAt as { toDate?: () => Date })?.toDate?.() ?? new Date(),
      };
    });
  } catch {
    return HARDCODED_EBOOKS;
  }
}

export async function getEbookBySlug(slug: string): Promise<ExtendedEbook | null> {
  try {
    if (!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) {
      return HARDCODED_EBOOKS.find((b) => b.slug === slug) ?? null;
    }
    const { db } = safeRequire("./firebase") || {};
    const fbFs = safeRequire("firebase/firestore");
    if (!db || !fbFs) return HARDCODED_EBOOKS.find((b) => b.slug === slug) ?? null;

    const q = fbFs.query(
      fbFs.collection(db, EBOOKS_COLLECTION),
      fbFs.where("slug", "==", slug)
    );
    const snapshot = await fbFs.getDocs(q);
    if (snapshot.empty) {
      return HARDCODED_EBOOKS.find((b) => b.slug === slug) ?? null;
    }
    const data = snapshot.docs[0].data();
    const fallback = HARDCODED_EBOOKS.find((b) => b.slug === slug || b.id === snapshot.docs[0].id);
    return {
      id: snapshot.docs[0].id,
      slug: data.slug as string,
      title: data.title as string,
      author: data.author as string,
      description: data.description as string,
      shortDescription: data.shortDescription as string,
      price: data.price as number,
      coverUrl: (data.coverUrl as string) || fallback?.coverUrl || "",
      pdfUrl: fallback?.pdfUrl || `/images/${data.slug}.pdf`,
      storagePath: (data.storagePath as string) || fallback?.storagePath || "",
      tags: data.tags as string[],
      pageCount: data.pageCount as number,
      readingTime: data.readingTime as string,
      createdAt: (data.createdAt as { toDate?: () => Date })?.toDate?.() ?? new Date(),
      updatedAt: (data.updatedAt as { toDate?: () => Date })?.toDate?.() ?? new Date(),
    };
  } catch {
    return HARDCODED_EBOOKS.find((b) => b.slug === slug) ?? null;
  }
}

export async function getEbookById(id: string): Promise<ExtendedEbook | null> {
  try {
    const fallback = HARDCODED_EBOOKS.find((b) => b.id === id);
    if (fallback) return fallback;
    const { db } = safeRequire("./firebase") || {};
    const fbFs = safeRequire("firebase/firestore");
    if (!db || !fbFs) return null;

    const docSnap = await fbFs.getDoc(fbFs.doc(db, EBOOKS_COLLECTION, id));
    if (!docSnap.exists()) return null;
    const data = docSnap.data();
    return {
      id: docSnap.id,
      slug: data.slug as string,
      title: data.title as string,
      author: data.author as string,
      description: data.description as string,
      shortDescription: data.shortDescription as string,
      price: data.price as number,
      coverUrl: data.coverUrl as string,
      pdfUrl: `/images/${data.slug}.pdf`,
      storagePath: data.storagePath as string,
      tags: data.tags as string[],
      pageCount: data.pageCount as number,
      readingTime: data.readingTime as string,
      createdAt: (data.createdAt as { toDate?: () => Date })?.toDate?.() ?? new Date(),
      updatedAt: (data.updatedAt as { toDate?: () => Date })?.toDate?.() ?? new Date(),
    };
  } catch {
    return HARDCODED_EBOOKS.find((b) => b.id === id) ?? null;
  }
}
