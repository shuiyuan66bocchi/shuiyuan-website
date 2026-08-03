import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth/apiAuth';

export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      where: { featured: true },
      orderBy: { createdAt: 'desc' },
      take: 6,
    });

    return Response.json(projects);
  } catch (error) {
    console.error('Failed to fetch featured projects:', error);
    return Response.json({ error: 'Failed to fetch projects' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const authError = await requireAuth();
  if (authError) return authError;

  try {
    const body = await request.json();
    const { title, slug, description, content, techStack, demoUrl, repoUrl, featured } = body;

    if (!title || !slug) {
      return Response.json(
        { error: 'Missing required fields: title, slug' },
        { status: 400 },
      );
    }

    const existing = await prisma.project.findUnique({ where: { slug } });
    if (existing) {
      return Response.json({ error: 'A project with this slug already exists' }, { status: 409 });
    }

    const project = await prisma.project.create({
      data: {
        title,
        slug,
        description: description ?? null,
        content: content ?? null,
        techStack: techStack ?? undefined,
        demoUrl: demoUrl ?? null,
        repoUrl: repoUrl ?? null,
        featured: featured ?? false,
      },
    });

    return Response.json(project, { status: 201 });
  } catch (error) {
    console.error('Failed to create project:', error);
    return Response.json({ error: 'Failed to create project' }, { status: 500 });
  }
}
