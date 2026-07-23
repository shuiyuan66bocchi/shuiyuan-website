'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

// ─── Project Actions ───

export async function createProject(formData: FormData) {
  const title = formData.get('title') as string;
  const slug = formData.get('slug') as string;
  const description = formData.get('description') as string;
  const content = formData.get('content') as string;
  const techStackInput = formData.get('techStack') as string;
  const demoUrl = formData.get('demoUrl') as string;
  const repoUrl = formData.get('repoUrl') as string;
  const featured = formData.get('featured') === 'on';

  await prisma.project.create({
    data: {
      title,
      slug,
      description,
      content,
      techStack: techStackInput
        ? techStackInput.split(',').map((s) => s.trim())
        : undefined,
      demoUrl,
      repoUrl,
      featured,
    },
  });

  revalidatePath('/admin/projects');
  revalidatePath('/projects');
  revalidatePath('/');
  redirect('/admin/projects');
}

export async function updateProject(formData: FormData) {
  const id = formData.get('id') as string;
  const title = formData.get('title') as string;
  const slug = formData.get('slug') as string;
  const description = formData.get('description') as string;
  const content = formData.get('content') as string;
  const techStackInput = formData.get('techStack') as string;
  const demoUrl = formData.get('demoUrl') as string;
  const repoUrl = formData.get('repoUrl') as string;
  const featured = formData.get('featured') === 'on';

  await prisma.project.update({
    where: { id },
    data: {
      title,
      slug,
      description,
      content,
      techStack: techStackInput
        ? techStackInput.split(',').map((s) => s.trim())
        : undefined,
      demoUrl,
      repoUrl,
      featured,
    },
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
  const title = formData.get('title') as string;
  const slug = formData.get('slug') as string;
  const content = formData.get('content') as string;
  const excerpt = formData.get('excerpt') as string;
  const published = formData.get('published') === 'on';

  await prisma.post.create({
    data: { title, slug, content, excerpt, published },
  });

  revalidatePath('/admin/posts');
  revalidatePath('/blog');
  redirect('/admin/posts');
}

export async function updatePost(formData: FormData) {
  const id = formData.get('id') as string;
  const title = formData.get('title') as string;
  const slug = formData.get('slug') as string;
  const content = formData.get('content') as string;
  const excerpt = formData.get('excerpt') as string;
  const published = formData.get('published') === 'on';

  await prisma.post.update({
    where: { id },
    data: { title, slug, content, excerpt, published },
  });

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
