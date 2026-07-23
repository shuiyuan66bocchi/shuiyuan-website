import { z } from 'zod';

export const createProjectSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  slug: z
    .string()
    .min(1)
    .max(200)
    .regex(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric with hyphens'),
  description: z.string().optional().default(''),
  content: z.string().optional().default(''),
  techStack: z.union([z.string(), z.array(z.string())]).optional(),
  demoUrl: z.string().url('Invalid URL').optional().or(z.literal('')),
  repoUrl: z.string().url('Invalid URL').optional().or(z.literal('')),
  featured: z.boolean().optional().default(false),
});

export const updateProjectSchema = createProjectSchema.partial().extend({
  slug: z
    .string()
    .min(1)
    .max(200)
    .regex(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric with hyphens')
    .optional(),
});

export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;
