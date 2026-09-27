import type { UserProfile } from '$lib/requests/models/UserProfile.ts';
import type { UserStats } from '$lib/requests/models/UserStats.ts';

export type ProfileContext = {
  slug: string;
  profile: UserProfile | undefined;
  name: string;
  isMe: boolean;
  stats: UserStats | null;
  isStatsLoading: boolean;
};
