import type { SocialActivity } from '$lib/requests/models/SocialActivity.ts';
import type { UserProfile } from '$lib/requests/models/UserProfile.ts';
import type { PosterMedia } from '../../poster/PosterMedia.ts';

export type FriendsPoster = {
  media: PosterMedia;
  friends: ReadonlyArray<UserProfile>;
  rating: number | null;
};

function toPosterMedia(activity: SocialActivity): PosterMedia {
  return activity.type === 'movie' ? activity.movie : activity.show;
}

export function toFriendsPosters(
  activities: ReadonlyArray<SocialActivity>,
  limit: number,
): FriendsPoster[] {
  const byKey = new Map<string, FriendsPoster>();

  for (const activity of activities) {
    const media = toPosterMedia(activity);
    const existing = byKey.get(media.key);
    const friends = [...(existing?.friends ?? []), ...activity.users]
      .filter((friend, index, all) =>
        all.findIndex((other) => other.id === friend.id) === index
      );

    byKey.set(media.key, {
      media,
      friends,
      rating: existing?.rating ?? activity.rating ?? null,
    });
  }

  return [...byKey.values()].slice(0, limit);
}
