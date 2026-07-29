import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

/** Maximum base64 image size: 500KB (prevents abuse) */
const MAX_IMAGE_SIZE = 500 * 1024;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { image } = body;

    if (!image || typeof image !== 'string') {
      return Response.json(
        { error: 'No image data provided' },
        { status: 400 }
      );
    }

    if (!image.startsWith('data:image/')) {
      return Response.json(
        { error: 'Not a valid image data URL' },
        { status: 400 }
      );
    }

    // Reject oversized images
    if (image.length > MAX_IMAGE_SIZE) {
      return Response.json(
        { error: 'Image too large. Maximum 500KB.' },
        { status: 400 }
      );
    }

    // Store base64 directly in the database (works on Vercel's read-only filesystem)
    await prisma.profile.upsert({
      where: { id: 'default' },
      update: { avatarUrl: image },
      create: { id: 'default', avatarUrl: image },
    });

    return Response.json({ avatarUrl: image });
  } catch (error) {
    console.error('Upload avatar error:', error);
    const msg = error instanceof Error ? error.message : String(error);
    return Response.json({ error: 'Upload failed', detail: msg }, { status: 500 });
  }
}
