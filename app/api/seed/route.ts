import { prisma } from '@/lib/prisma';
import { hashPassword } from '@/lib/auth/password';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

/**
 * One-click database setup endpoint.
 * - Generates bcrypt password hash from ADMIN_PASSWORD or ADMIN_TOKEN env var
 * - Seeds sample projects and blog posts if the database is empty
 *
 * Usage: visit /api/seed in your browser
 */

export async function GET() {
  try {
    const log: string[] = [];

    // ─── 1. Always set admin password if ADMIN_PASSWORD is configured ───
    const adminPassword = process.env.ADMIN_PASSWORD;
    if (adminPassword) {
      const hash = await hashPassword(adminPassword);
      await prisma.profile.upsert({
        where: { id: 'default' },
        update: { passwordHash: hash },
        create: { id: 'default', name: 'shuiyuan', title: 'Full-stack developer', passwordHash: hash },
      });
      log.push('✅ Password hash set — you can now log in via /login');
    } else {
      // Fallback for legacy ADMIN_TOKEN
      const adminToken = process.env.ADMIN_TOKEN;
      if (adminToken) {
        const hash = await hashPassword(adminToken);
        await prisma.profile.upsert({
          where: { id: 'default' },
          update: { passwordHash: hash },
          create: { id: 'default', name: 'shuiyuan', title: 'Full-stack developer', passwordHash: hash },
        });
        log.push('✅ Password hash set from ADMIN_TOKEN (migrated to ADMIN_PASSWORD)');
      } else {
        log.push('⚠ No ADMIN_PASSWORD or ADMIN_TOKEN set — login will not work');
      }
    }

    // ─── 2. Seed content if empty ───
    const existingProjects = await prisma.project.count();
    if (existingProjects === 0) {
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
            description: 'Full-stack e-commerce solution with product catalog and secure checkout.',
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
            content: '# Getting Started with Next.js 16\n\nNext.js 16 brings a host of new features.',
            excerpt: 'Explore the key changes in Next.js 16.',
            published: true,
          },
          {
            title: 'Understanding Prisma 7',
            slug: 'understanding-prisma-7',
            content: '# Understanding Prisma 7\n\nPrisma 7 introduces a new configuration system.',
            excerpt: 'A comprehensive guide to Prisma 7.',
            published: true,
          },
        ],
      });

      log.push('✅ Created 3 projects and 2 blog posts');
    } else {
      log.push('ℹ Content data already exists, skipped');
    }

    return NextResponse.json({
      message: log.join('<br>'),
      steps: log,
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
