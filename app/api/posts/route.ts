import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth, isAuthenticated } from '@/lib/auth/apiAuth';

// GET /api/posts — List all published posts (public)
// GET /api/posts?all=true — List all posts including drafts (requires auth)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const showAll = searchParams.get('all') === 'true';

    // Only authenticated admins can see draft posts
    if (showAll) {
      const authError = await requireAuth();
      if (authError) return authError;
    }

    const posts = await prisma.post.findMany({
      where: showAll ? {} : { published: true },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        published: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return Response.json(posts);
  } catch (error) {
    console.error('Failed to fetch posts:', error);
    return Response.json({ error: 'Failed to fetch posts' }, { status: 500 });
  }
}

// POST /api/posts — Create a new blog post (requires auth)
export async function POST(request: NextRequest) {
  const authError = await requireAuth();
  if (authError) return authError;

  try {
    const body = await request.json();
    const { title, slug, content, excerpt, published } = body;

    if (!title || !slug || !content) {
      return Response.json(
        { error: 'Missing required fields: title, slug, content' },
        { status: 400 },
      );
    }

    // Check slug uniqueness
    const existing = await prisma.post.findUnique({ where: { slug } });
    if (existing) {
      return Response.json({ error: 'A post with this slug already exists' }, { status: 409 });
    }

    const post = await prisma.post.create({
      data: {
        title,
        slug,
        content,
        excerpt: excerpt ?? null,
        published: published ?? false,
      },
    });

    return Response.json(post, { status: 201 });
  } catch (error) {
    console.error('Failed to create post:', error);
    return Response.json({ error: 'Failed to create post' }, { status: 500 });
  }
}
