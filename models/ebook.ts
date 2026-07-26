export interface Ebook {
  id: string;
  slug: string;
  title: string;
  author: string;
  description: string;
  shortDescription: string;
  price: number; // USD cents — e.g. 1997 = $19.97
  isPayWhatYouWant?: boolean;
  minPrice?: number;
  coverUrl: string;
  screenshots?: string[];

  pdfUrl?: string;
  storagePath: string; // Firebase Storage path — never exposed to client

  tags: string[];
  pageCount: number;
  readingTime: string; // e.g. "12 min"
  createdAt: Date;
  updatedAt: Date;
}
