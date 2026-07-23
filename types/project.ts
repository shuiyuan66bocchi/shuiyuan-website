/** Runtime-validated tech stack array */
export type TechStack = string[];

/** Parsed tech stack from Prisma JSON field */
export function parseTechStack(techStack: unknown): TechStack {
  if (typeof techStack === 'string') {
    try {
      const parsed = JSON.parse(techStack);
      return Array.isArray(parsed) ? parsed.map(String) : [];
    } catch {
      return [];
    }
  }
  return Array.isArray(techStack) ? techStack.map(String) : [];
}

/** Form data for creating/updating a project */
export interface ProjectFormData {
  title: string;
  slug: string;
  description: string | null;
  content: string | null;
  techStack: string | null;
  demoUrl: string | null;
  repoUrl: string | null;
  featured: boolean;
}

/** Shape returned by the Project Prisma model (serializable) */
export interface ProjectResponse {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  content: string | null;
  techStack: TechStack;
  imageUrl: string | null;
  demoUrl: string | null;
  repoUrl: string | null;
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}
