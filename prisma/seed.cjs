const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const bcrypt = require('bcryptjs');

const prisma = process.env.DATABASE_URL
  ? new PrismaClient({ adapter: new PrismaPg(process.env.DATABASE_URL) })
  : new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // ─── Admin Password ───
  const adminPassword = process.env.ADMIN_PASSWORD;
  let passwordHash = null;

  if (adminPassword) {
    passwordHash = await bcrypt.hash(adminPassword, 12);
    console.log('Admin password hash generated');
  } else {
    console.warn('⚠ ADMIN_PASSWORD not set — run with ADMIN_PASSWORD=yourpassword');
  }

  // ─── Profile ───
  await prisma.profile.upsert({
    where: { id: 'default' },
    update: { passwordHash: passwordHash ?? undefined },
    create: {
      id: 'default',
      name: 'shuiyuan',
      title: 'Full-stack developer',
      passwordHash,
    },
  });
  console.log('Profile ready');

  // ─── Clear content data ───
  await prisma.contactMessage.deleteMany();
  await prisma.post.deleteMany();
  await prisma.project.deleteMany();

  // ─── Projects ───
  await Promise.all([
    prisma.project.create({
      data: {
        title: 'Portfolio Website',
        slug: 'portfolio-website',
        description: 'A modern, responsive portfolio website built with Next.js and Tailwind CSS.',
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
        description: 'Full-stack e-commerce solution with product catalog, shopping cart, and secure checkout.',
        content: 'Built with React, Node.js, and PostgreSQL.',
        techStack: ['React', 'Node.js', 'PostgreSQL', 'Prisma'],
        demoUrl: '#',
        featured: true,
      },
    }),
    prisma.project.create({
      data: {
        title: 'Task Management App',
        slug: 'task-management-app',
        description: 'Productivity application for managing tasks and projects.',
        content: 'Built with React, Firebase, and Tailwind CSS.',
        techStack: ['React', 'Firebase', 'Tailwind CSS'],
        featured: true,
      },
    }),
  ]);
  console.log('Created 3 projects');

  // ─── Blog Posts ───
  await Promise.all([
    prisma.post.create({
      data: {
        title: 'Getting Started with Next.js 16',
        slug: 'getting-started-with-nextjs-16',
        content: `# Getting Started with Next.js 16\n\nNext.js 16 brings a host of new features and improvements.`,
        excerpt: 'Explore the key changes in Next.js 16.',
        published: true,
      },
    }),
    prisma.post.create({
      data: {
        title: 'Understanding Prisma 7',
        slug: 'understanding-prisma-7',
        content: `# Understanding Prisma 7\n\nPrisma 7 introduces a new configuration system.`,
        excerpt: 'A comprehensive guide to Prisma 7.',
        published: true,
      },
    }),
    prisma.post.create({
      data: {
        title: 'Building a Portfolio with Next.js',
        slug: 'building-portfolio-nextjs-tailwind',
        content: `# Building a Portfolio\n\nLearn how I built my personal portfolio.`,
        excerpt: 'Learn how I built my personal portfolio.',
        published: true,
      },
    }),
  ]);
  console.log('Created 3 blog posts');

  console.log('Seeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
