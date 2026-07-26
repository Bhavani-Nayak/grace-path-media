export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string; // HTML or markdown content
  author: string;
  coverUrl: string;
  tags: string[];
  publishedAt: Date;
  updatedAt: Date;
  isPublished: boolean;
}
