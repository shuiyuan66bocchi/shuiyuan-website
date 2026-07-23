/** Form data for creating/updating a post */
export interface PostFormData {
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  published: boolean;
}

/** Shape returned by the Post Prisma model (serializable) */
export interface PostResponse {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}
