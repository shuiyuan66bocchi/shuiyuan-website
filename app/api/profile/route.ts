import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    let profile = await prisma.profile.findUnique({ where: { id: 'default' } });
    if (!profile) {
      profile = await prisma.profile.create({
        data: { id: 'default', name: 'shuiyuan', title: 'Full-stack developer' },
      });
    }
    return Response.json(profile);
  } catch (error) {
    console.error('Failed to fetch profile:', error);
    return Response.json({ error: 'Failed to fetch profile' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, title } = body;

    const profile = await prisma.profile.upsert({
      where: { id: 'default' },
      update: {
        ...(name !== undefined && { name }),
        ...(title !== undefined && { title }),
      },
      create: {
        id: 'default',
        name: name ?? 'shuiyuan',
        title: title ?? 'Full-stack developer',
      },
    });

    return Response.json(profile);
  } catch (error) {
    console.error('Failed to update profile:', error);
    return Response.json({ error: 'Failed to update profile' }, { status: 500 });
  }
}
