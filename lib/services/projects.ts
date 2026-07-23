import { prisma } from '@/lib/prisma';

export async function getFeaturedProjects(limit = 4) {
  return prisma.project.findMany({
    where: { featured: true },
    orderBy: { createdAt: 'desc' },
    take: limit,
  });
}

export async function getAllProjects() {
  return prisma.project.findMany({
    orderBy: { createdAt: 'desc' },
  });
}

export async function getProjectById(id: string) {
  return prisma.project.findUnique({ where: { id } });
}

export async function getProjectStats() {
  const [total, featured] = await Promise.all([
    prisma.project.count(),
    prisma.project.count({ where: { featured: true } }),
  ]);
  return { total, featured };
}
