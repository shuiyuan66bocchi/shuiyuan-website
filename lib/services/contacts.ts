import { prisma } from '@/lib/prisma';

export async function getAllMessages() {
  return prisma.contactMessage.findMany({
    orderBy: { createdAt: 'desc' },
  });
}
