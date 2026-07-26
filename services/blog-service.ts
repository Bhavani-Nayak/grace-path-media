import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import { db } from "./firebase";
import type { BlogPost } from "@/models/blog-post";
import { HARDCODED_BLOG_POSTS } from "@/lib/blog-data";

const BLOG_COLLECTION = "blog-posts";

export async function getBlogPosts(): Promise<BlogPost[]> {
  try {
    if (!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) {
      return HARDCODED_BLOG_POSTS;
    }
    const q = query(
      collection(db, BLOG_COLLECTION),
      where("isPublished", "==", true),
      orderBy("publishedAt", "desc")
    );
    const snapshot = await getDocs(q);
    if (snapshot.empty) {
      return HARDCODED_BLOG_POSTS;
    }
    return snapshot.docs.map((docSnap) => {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        slug: data.slug as string,
        title: data.title as string,
        excerpt: data.excerpt as string,
        content: data.content as string,
        author: data.author as string,
        coverUrl: data.coverUrl as string,
        tags: data.tags as string[],
        publishedAt: (data.publishedAt as { toDate?: () => Date })?.toDate?.() ?? new Date(),
        updatedAt: (data.updatedAt as { toDate?: () => Date })?.toDate?.() ?? new Date(),
        isPublished: data.isPublished as boolean,
      };
    });
  } catch {
    return HARDCODED_BLOG_POSTS;
  }
}

export async function getBlogPostBySlug(
  slug: string
): Promise<BlogPost | null> {
  try {
    if (!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) {
      return HARDCODED_BLOG_POSTS.find((p) => p.slug === slug) ?? null;
    }
    const q = query(
      collection(db, BLOG_COLLECTION),
      where("slug", "==", slug),
      where("isPublished", "==", true)
    );
    const snapshot = await getDocs(q);
    if (snapshot.empty) {
      return HARDCODED_BLOG_POSTS.find((p) => p.slug === slug) ?? null;
    }
    const data = snapshot.docs[0].data();
    return {
      id: snapshot.docs[0].id,
      slug: data.slug as string,
      title: data.title as string,
      excerpt: data.excerpt as string,
      content: data.content as string,
      author: data.author as string,
      coverUrl: data.coverUrl as string,
      tags: data.tags as string[],
      publishedAt: (data.publishedAt as { toDate?: () => Date })?.toDate?.() ?? new Date(),
      updatedAt: (data.updatedAt as { toDate?: () => Date })?.toDate?.() ?? new Date(),
      isPublished: data.isPublished as boolean,
    };
  } catch {
    return HARDCODED_BLOG_POSTS.find((p) => p.slug === slug) ?? null;
  }
}

