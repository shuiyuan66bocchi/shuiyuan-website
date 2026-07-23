import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { writeFile, mkdir, access } from 'fs/promises';
import path from 'path';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { image } = body;

    if (!image || typeof image !== 'string') {
      return Response.json({ error: 'No image data provided', detail: typeof image }, { status: 400 });
    }

    // Check if it's a valid data URL
    if (!image.startsWith('data:image/')) {
      return Response.json({ error: 'Not a valid image data URL', detail: image.slice(0, 50) }, { status: 400 });
    }

    // Decode base64 image
    const matches = image.match(/^data:image\/(\w+);base64,(.+)$/);
    if (!matches) {
      return Response.json({ error: 'Invalid image format - regex failed' }, { status: 400 });
    }

    const ext = matches[1] === 'jpeg' ? 'jpg' : matches[1];
    const buffer = Buffer.from(matches[2], 'base64');

    if (buffer.length === 0) {
      return Response.json({ error: 'Decoded buffer is empty' }, { status: 400 });
    }

    const avatarDir = path.join(process.cwd(), 'public', 'avatars');
    const filepath = path.join(avatarDir, `avatar.${ext}`);

    // Ensure directory exists
    await mkdir(avatarDir, { recursive: true });

    // Write file
    await writeFile(filepath, buffer);

    // Update profile in DB
    const avatarUrl = `/avatars/avatar.${ext}`;
    await prisma.profile.upsert({
      where: { id: 'default' },
      update: { avatarUrl },
      create: { id: 'default', avatarUrl },
    });

    return Response.json({ avatarUrl });
  } catch (error) {
    console.error('Upload avatar error:', error);
    const msg = error instanceof Error ? error.message : String(error);
    return Response.json({ error: 'Upload failed', detail: msg }, { status: 500 });
  }
}
