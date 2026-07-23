import { defineConfig } from 'prisma/config';

export default defineConfig({
  schema: 'prisma/schema.prisma',
  datasource: {
    url: process.env.DATABASE_URL ?? 'postgresql://localhost:5432/my_website',
  },
  migrations: {
    seed: 'node prisma/seed.cjs',
  },
});
