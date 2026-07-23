/** Profile data for display/edit */
export interface ProfileData {
  id: string;
  name: string;
  title: string;
  avatarUrl: string | null;
}

/** Profile update payload */
export interface ProfileUpdate {
  name?: string;
  title?: string;
}
