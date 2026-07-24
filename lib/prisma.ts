import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient() {
  if (process.env.DATABASE_URL) {
    // Vercel/Neon: use HTTP-based adapter for serverless
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { PrismaNeonHttp } = require('@prisma/adapter-neon');
    const adapter = new PrismaNeonHttp(process.env.DATABASE_URL);
    return new PrismaClient({ adapter });
  }

  // Local dev: use built-in SQLite or direct connection
  return new PrismaClient();
}

export const prisma =
  globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
