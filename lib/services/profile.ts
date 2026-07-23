import { prisma } from '@/lib/prisma';
import type { Profile } from '@prisma/client';

const DEFAULT_PROFILE_ID = 'default';

export async function getProfile(): Promise<Profile> {
  let profile = await prisma.profile.findUnique({ where: { id: DEFAULT_PROFILE_ID } });
  if (!profile) {
    profile = await prisma.profile.create({
      data: { id: DEFAULT_PROFILE_ID, name: 'shuiyuan', title: 'Full-stack developer' },
    });
  }
  return profile;
}

export async function getUnreadMessageCount(): Promise<number> {
  return prisma.contactMessage.count({ where: { read: false } });
}
