'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createPostSchema, updatePostSchema } from '@/lib/validations/post';
import { createProjectSchema, updateProjectSchema } from '@/lib/validations/project';

/** Normalize techStack from comma-string to string array */
function normalizeTechStack(input: unknown): string[] | undefined {
  if (!input || (typeof input === 'string' && input.trim() === '')) return undefined;
  if (typeof input === 'string') return input.split(',').map((s) => s.trim());
  if (Array.isArray(input)) return input;
  return undefined;
}

// ─── Project Actions ───

export async function createProject(formData: FormData) {
  const parsed = createProjectSchema.safeParse({
    title: formData.get('title'),
    slug: formData.get('slug'),
    description: formData.get('description'),
    content: formData.get('content'),
    techStack: formData.get('techStack'),
    demoUrl: formData.get('demoUrl'),
    repoUrl: formData.get('repoUrl'),
    featured: formData.get('featured') === 'on',
  });

  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? 'Validation failed');
  }

  const { title, slug, description, content, techStack, demoUrl, repoUrl, featured } = parsed.data;

  await prisma.project.create({
    data: { title, slug, description, content, techStack: normalizeTechStack(techStack), demoUrl, repoUrl, featured },
  });

  revalidatePath('/admin/projects');
  revalidatePath('/projects');
  revalidatePath('/');
  redirect('/admin/projects');
}

export async function updateProject(formData: FormData) {
  const id = formData.get('id') as string;

  const parsed = updateProjectSchema.safeParse({
    title: formData.get('title'),
    slug: formData.get('slug'),
    description: formData.get('description'),
    content: formData.get('content'),
    techStack: formData.get('techStack'),
    demoUrl: formData.get('demoUrl'),
    repoUrl: formData.get('repoUrl'),
    featured: formData.get('featured') === 'on',
  });

  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? 'Validation failed');
  }

  const { title, slug, description, content, techStack, demoUrl, repoUrl, featured } = parsed.data;

  await prisma.project.update({
    where: { id },
    data: { title, slug, description, content, techStack, demoUrl, repoUrl, featured },
  });

  revalidatePath('/admin/projects');
  revalidatePath('/projects');
  revalidatePath('/');
  redirect('/admin/projects');
}

export async function deleteProject(formData: FormData) {
  const id = formData.get('id') as string;

  await prisma.project.delete({ where: { id } });

  revalidatePath('/admin/projects');
  revalidatePath('/projects');
  revalidatePath('/');
}

// ─── Post Actions ───

export async function createPost(formData: FormData) {
  const parsed = createPostSchema.safeParse({
    title: formData.get('title'),
    slug: formData.get('slug'),
    content: formData.get('content'),
    excerpt: formData.get('excerpt'),
    published: formData.get('published') === 'on',
  });

  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? 'Validation failed');
  }

  const { title, slug, content, excerpt, published } = parsed.data;

  await prisma.post.create({
    data: { title, slug, content, excerpt, published },
  });

  revalidatePath('/admin/posts');
  revalidatePath('/blog');
  redirect('/admin/posts');
}

export async function updatePost(formData: FormData) {
  const id = formData.get('id') as string;

  const parsed = updatePostSchema.safeParse({
    title: formData.get('title') || undefined,
    slug: formData.get('slug') || undefined,
    content: formData.get('content') || undefined,
    excerpt: formData.get('excerpt') || undefined,
    published: formData.get('published') === 'on' || undefined,
  });

  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? 'Validation failed');
  }

  const data = Object.fromEntries(
    Object.entries(parsed.data).filter(([_, v]) => v !== undefined)
  );

  await prisma.post.update({ where: { id }, data });

  revalidatePath('/admin/posts');
  revalidatePath('/blog');
  redirect('/admin/posts');
}

export async function deletePost(formData: FormData) {
  const id = formData.get('id') as string;

  await prisma.post.delete({ where: { id } });

  revalidatePath('/admin/posts');
  revalidatePath('/blog');
}

// ─── Contact Actions ───

export async function markMessageAsRead(formData: FormData) {
  const id = formData.get('id') as string;

  await prisma.contactMessage.update({
    where: { id },
    data: { read: true },
  });

  revalidatePath('/admin/contacts');
}

export async function deleteMessage(formData: FormData) {
  const id = formData.get('id') as string;

  await prisma.contactMessage.delete({ where: { id } });

  revalidatePath('/admin/contacts');
}
