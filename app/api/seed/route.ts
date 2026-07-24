import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Check if already seeded
    const existingProjects = await prisma.project.count();
    if (existingProjects > 0) {
      return NextResponse.json({ message: 'Database already has data, skipping seed.' });
    }

    // Create profile
    await prisma.profile.upsert({
      where: { id: 'default' },
      update: {},
      create: { id: 'default', name: 'shuiyuan', title: 'Full-stack developer' },
    });

    // Create projects
    await prisma.project.createMany({
      data: [
        {
          title: 'Portfolio Website',
          slug: 'portfolio-website',
          description: 'A modern, responsive portfolio website built with Next.js and Tailwind CSS.',
          techStack: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Vercel'],
          featured: true,
        },
        {
          title: 'E-commerce Platform',
          slug: 'ecommerce-platform',
          description: 'Full-stack e-commerce solution with product catalog, shopping cart, and secure checkout.',
          techStack: ['React', 'Node.js', 'PostgreSQL', 'Prisma'],
          featured: true,
        },
        {
          title: 'Task Management App',
          slug: 'task-management-app',
          description: 'Productivity application for managing tasks and projects.',
          techStack: ['React', 'Firebase', 'Tailwind CSS'],
          featured: true,
        },
      ],
    });

    await prisma.post.createMany({
      data: [
        {
          title: 'Getting Started with Next.js 16',
          slug: 'getting-started-with-nextjs-16',
          content: `# Getting Started with Next.js 16\n\nNext.js 16 brings a host of new features and improvements.\n\n## What's New\n\n- **Stable Caching**: The cacheLife and cacheTag APIs are now stable\n- **Async Params**: Route handler params are now always async\n- **Improved Server Actions**: Better developer experience for mutations\n`,
          excerpt: 'Explore the key changes in Next.js 16.',
          published: true,
        },
        {
          title: 'Understanding Prisma 7',
          slug: 'understanding-prisma-7',
          content: `# Understanding Prisma 7\n\nPrisma 7 introduces a new configuration system.\n\n## Key Changes\n\n### Config File Required\n\nThe url field has been moved to prisma.config.ts.\n\n### Driver Adapters Required\n\nYou must use a driver adapter when creating PrismaClient.\n`,
          excerpt: 'A comprehensive guide to Prisma 7.',
          published: true,
        },
      ],
    });

    return NextResponse.json({
      message: 'Database seeded successfully!',
      projects: 3,
      posts: 2,
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
