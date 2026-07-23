import { prisma } from '@/lib/prisma';

export async function getPublishedPosts(limit = 10) {
  return prisma.post.findMany({
    where: { published: true },
    orderBy: { createdAt: 'desc' },
    take: limit,
  });
}

export async function getAllPosts() {
  return prisma.post.findMany({
    orderBy: { createdAt: 'desc' },
  });
}

export async function getPostBySlug(slug: string) {
  return prisma.post.findUnique({ where: { slug } });
}

export async function getPostById(id: string) {
  return prisma.post.findUnique({ where: { id } });
}

export async function getPostStats() {
  const [total, published] = await Promise.all([
    prisma.post.count(),
    prisma.post.count({ where: { published: true } }),
  ]);
  return { total, published };
}
