import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient() {
  if (process.env.DATABASE_URL) {
    // Vercel production: use PostgreSQL via pg adapter
    const adapter = new PrismaPg(process.env.DATABASE_URL);
    return new PrismaClient({ adapter });
  }

  // Local dev: no DATABASE_URL → use SQLite (built-in, no adapter needed)
  return new PrismaClient();
}

export const prisma =
  globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
