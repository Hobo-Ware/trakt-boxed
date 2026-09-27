import type { SocialActivity } from '$lib/requests/models/SocialActivity.ts';
import { episodeSubtitle } from '$lib/utils/intl/episodeSubtitle.ts';
import { toDisplayableName } from '$lib/utils/profile/toDisplayableName.ts';
import { UrlBuilder } from '$lib/utils/url/UrlBuilder.ts';
import type { ActivityActor, ActivityEvent } from '../ActivityEvent.ts';

function toActor(
  user: SocialActivity['users'][number] | undefined,
): ActivityActor {
  if (!user) return { name: '', href: '', avatar: '' };

  return {
    name: toDisplayableName(user),
    href: UrlBuilder.profile.user(user.slug ?? user.username),
    avatar: user.avatar.url,
  };
}

export function fromSocialActivity(activity: SocialActivity): ActivityEvent {
  const common = {
    key: activity.key,
    at: activity.activityAt,
    actor: toActor(activity.users.at(0)),
    others: Math.max(activity.users.length - 1, 0),
    rating: activity.rating ?? null,
  };

  if (activity.type === 'movie') {
    return {
      ...common,
      type: 'movie',
      title: activity.movie.title,
      code: null,
      href: UrlBuilder.movie(activity.movie.slug),
      poster: activity.movie.poster.url.thumb,
    };
  }

  return {
    ...common,
    type: 'episode',
    title: activity.show.title,
    code: episodeSubtitle(activity.episode),
    href: UrlBuilder.show(activity.show.slug),
    poster: activity.show.poster.url.thumb,
  };
}
