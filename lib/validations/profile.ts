import { z } from 'zod';

export const updateProfileSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100).optional(),
  title: z.string().max(200).optional(),
});

export const avatarUploadSchema = z.object({
  image: z.string().min(1, 'Image data is required').refine(
    (val) => val.startsWith('data:image/'),
    'Invalid image data URL'
  ),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type AvatarUploadInput = z.infer<typeof avatarUploadSchema>;
