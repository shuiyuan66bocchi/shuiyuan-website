import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';

type RouteContext = {
  params: Promise<{ slug: string }>;
};

// GET /api/posts/:slug — Get a single post by slug
export async function GET(_request: NextRequest, context: RouteContext) {
  try {
    const { slug } = await context.params;

    const post = await prisma.post.findUnique({
      where: { slug },
    });

    if (!post) {
      return Response.json({ error: 'Post not found' }, { status: 404 });
    }

    return Response.json(post);
  } catch (error) {
    console.error('Failed to fetch post:', error);
    return Response.json({ error: 'Failed to fetch post' }, { status: 500 });
  }
}

// PUT /api/posts/:slug — Update a post by slug
export async function PUT(request: NextRequest, context: RouteContext) {
  try {
    const { slug } = await context.params;
    const body = await request.json();
    const { title, content, excerpt, published } = body;

    const existing = await prisma.post.findUnique({ where: { slug } });
    if (!existing) {
      return Response.json({ error: 'Post not found' }, { status: 404 });
    }

    // If changing slug, check uniqueness
    if (body.slug && body.slug !== slug) {
      const slugExists = await prisma.post.findUnique({
        where: { slug: body.slug },
      });
      if (slugExists) {
        return Response.json({ error: 'A post with this slug already exists' }, { status: 409 });
      }
    }

    const post = await prisma.post.update({
      where: { slug },
      data: {
        ...(title !== undefined && { title }),
        ...(body.slug !== undefined && { slug: body.slug }),
        ...(content !== undefined && { content }),
        ...(excerpt !== undefined && { excerpt }),
        ...(published !== undefined && { published }),
      },
    });

    return Response.json(post);
  } catch (error) {
    console.error('Failed to update post:', error);
    return Response.json({ error: 'Failed to update post' }, { status: 500 });
  }
}

// DELETE /api/posts/:slug — Delete a post by slug
export async function DELETE(_request: NextRequest, context: RouteContext) {
  try {
    const { slug } = await context.params;

    const existing = await prisma.post.findUnique({ where: { slug } });
    if (!existing) {
      return Response.json({ error: 'Post not found' }, { status: 404 });
    }

    await prisma.post.delete({ where: { slug } });

    return Response.json({ success: true });
  } catch (error) {
    console.error('Failed to delete post:', error);
    return Response.json({ error: 'Failed to delete post' }, { status: 500 });
  }
}
