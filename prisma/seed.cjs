const { PrismaClient } = require('@prisma/client');

let prisma;

// Try to create client with Neon adapter if DATABASE_URL is set
if (process.env.DATABASE_URL) {
  const { PrismaNeon } = require('@prisma/adapter-neon');
  const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL });
  prisma = new PrismaClient({ adapter });
} else {
  prisma = new PrismaClient();
}

async function main() {
  console.log('Seeding database...');

  // Clear existing data
  await prisma.profile.deleteMany();
  await prisma.contactMessage.deleteMany();
  await prisma.post.deleteMany();
  await prisma.project.deleteMany();

  // Seed Profile
  await prisma.profile.create({
    data: { id: 'default', name: 'shuiyuan', title: 'Full-stack developer' },
  });
  console.log('Created profile');

  // Seed Projects
  const projects = await Promise.all([
    prisma.project.create({
      data: {
        title: 'Portfolio Website',
        slug: 'portfolio-website',
        description:
          'A modern, responsive portfolio website built with Next.js and Tailwind CSS. Features include project showcase, skills visualization, and contact form.',
        content: 'Full project details and technical write-up coming soon.',
        techStack: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Vercel'],
        demoUrl: '#',
        repoUrl: 'https://github.com/username/portfolio',
        featured: true,
      },
    }),
    prisma.project.create({
      data: {
        title: 'E-commerce Platform',
        slug: 'ecommerce-platform',
        description:
          'Full-stack e-commerce solution with product catalog, shopping cart, and secure checkout.',
        content: 'Built with React, Node.js, and PostgreSQL.',
        techStack: ['React', 'Node.js', 'PostgreSQL', 'Prisma'],
        demoUrl: '#',
        repoUrl: 'https://github.com/username/ecommerce',
        featured: true,
      },
    }),
    prisma.project.create({
      data: {
        title: 'Task Management App',
        slug: 'task-management-app',
        description:
          'Productivity application for managing tasks and projects. Features real-time collaboration and drag-and-drop interface.',
        content: 'Built with React, Firebase, and Tailwind CSS.',
        techStack: ['React', 'Firebase', 'Tailwind CSS'],
        featured: true,
      },
    }),
  ]);
  console.log(`Created ${projects.length} projects`);

  // Seed Blog Posts
  const posts = await Promise.all([
    prisma.post.create({
      data: {
        title: 'Getting Started with Next.js 16',
        slug: 'getting-started-with-nextjs-16',
        content: `# Getting Started with Next.js 16

Next.js 16 brings a host of new features and improvements. In this post, we'll explore the key changes and how to make the most of them.

## What's New in Next.js 16

- **Stable Caching**: The \`cacheLife\` and \`cacheTag\` APIs are now stable
- **Async Params**: Route handler params are now always async
- **Improved Server Actions**: Better developer experience for mutations
- **Default Turbopack**: No need for the \`--turbopack\` flag

## Getting Started

Create a new Next.js project:

\`\`\`bash
npx create-next-app@latest my-app
\`\`\`

## Server Components

Server Components allow you to fetch data directly from your database:

\`\`\`tsx
export default async function Page() {
  const data = await db.query(...)
  return <div>{/* render */}</div>
}
\`\`\`

## Conclusion

Next.js 16 is a solid release that brings stability and performance improvements.
        `,
        excerpt:
          'Explore the key changes in Next.js 16 and how to make the most of the new features.',
        published: true,
      },
    }),
    prisma.post.create({
      data: {
        title: 'Understanding Prisma 7: A Complete Guide',
        slug: 'understanding-prisma-7',
        content: `# Understanding Prisma 7

Prisma 7 introduces a new configuration system that changes how you connect to databases.

## Key Changes

### 1. Config File Required

The \`url\` field has been moved from \`schema.prisma\` to \`prisma.config.ts\`:

\`\`\`ts
import { defineConfig } from 'prisma/config';

export default defineConfig({
  schema: 'prisma/schema.prisma',
  datasource: {
    url: 'file:./dev.db',
  },
});
\`\`\`

### 2. Driver Adapters Required

You must use a driver adapter when creating PrismaClient:

\`\`\`ts
const adapter = new PrismaSqlite({ url: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });
\`\`\`

## Why This Change?

This architecture allows Prisma to support more database types and runtimes more efficiently.

## Summary

While the changes require some setup adjustments, they provide a more flexible and performant foundation.
        `,
        excerpt:
          'A comprehensive guide to Prisma 7 and its new configuration system.',
        published: true,
      },
    }),
    prisma.post.create({
      data: {
        title: 'Building a Portfolio with Next.js and Tailwind CSS',
        slug: 'building-portfolio-nextjs-tailwind',
        content: `# Building a Portfolio with Next.js and Tailwind CSS

In this tutorial, I'll walk through how I built my personal portfolio using Next.js and Tailwind CSS.

## Design Choices

I wanted a clean, modern design with:
- Blue-purple gradient theme
- Card-based layout
- Responsive design
- Dark mode support

## Project Structure

\`\`\`
app/
  layout.tsx      # Root layout
  page.tsx        # Home page
  about/
  projects/
  contact/
components/
  ui/             # Reusable UI components
  layout/         # Layout components
data/             # Static data
prisma/           # Database schema
\`\`\`

## Key Features

1. **Server Components** for data fetching
2. **Client Components** for interactivity
3. **Prisma** for database access
4. **CMS** for managing content

## Tips

- Use the Card component pattern for consistent styling
- Leverage Next.js 16's improved caching
- Keep your design system consistent

## Conclusion

Building a portfolio is a great way to learn Next.js and showcase your skills.
        `,
        excerpt:
          'Learn how I built my personal portfolio using Next.js 16, Tailwind CSS v4, and Prisma 7.',
        published: true,
      },
    }),
  ]);
  console.log(`Created ${posts.length} blog posts`);

  console.log('Database seeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
