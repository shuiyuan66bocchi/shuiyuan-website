import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { contactMessageSchema } from '@/lib/validations/contact';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = contactMessageSchema.safeParse(body);

    if (!parsed.success) {
      return Response.json(
        { error: parsed.error.issues[0]?.message ?? 'Validation failed' },
        { status: 400 },
      );
    }

    const { name, email, subject, message } = parsed.data;

    await prisma.contactMessage.create({
      data: { name, email, subject, message },
    });

    return Response.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error('Failed to create contact message:', error);
    return Response.json({ error: 'Failed to send message' }, { status: 500 });
  }
}
