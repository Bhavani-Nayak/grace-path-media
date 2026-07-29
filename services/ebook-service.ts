import { HARDCODED_EBOOKS, ExtendedEbook } from "@/lib/ebook-data";

export async function getEbooks(): Promise<ExtendedEbook[]> {
  return HARDCODED_EBOOKS;
}

export async function getEbookBySlug(slug: string): Promise<ExtendedEbook | null> {
  return HARDCODED_EBOOKS.find((b) => b.slug === slug) ?? null;
}

export async function getEbookById(id: string): Promise<ExtendedEbook | null> {
  return HARDCODED_EBOOKS.find((b) => b.id === id) ?? null;
}

