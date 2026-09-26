import type { SocialActivity } from '$lib/requests/models/SocialActivity.ts';
import type { UserProfile } from '$lib/requests/models/UserProfile.ts';

export type JustWatchedEntry = {
  friend: UserProfile;
  activity: SocialActivity;
};

type ToJustWatchedParams = {
  activities: ReadonlyArray<SocialActivity>;
  now: Date;
  windowHours: number;
};

export function toJustWatched(
  { activities, now, windowHours }: ToJustWatchedParams,
): JustWatchedEntry[] {
  const since = now.getTime() - windowHours * 60 * 60 * 1000;

  const recent = activities
    .filter((activity) => activity.activityAt.getTime() >= since)
    .toSorted((a, b) => b.activityAt.getTime() - a.activityAt.getTime());

  const seen = new Set<number>();
  return recent.flatMap((activity) =>
    activity.users.flatMap((friend) => {
      if (seen.has(friend.id)) return [];
      seen.add(friend.id);
      return [{ friend, activity }];
    })
  );
}
