import * as m from '$lib/features/i18n/messages.ts';
import { UrlBuilder } from '$lib/utils/url/UrlBuilder.ts';
import type { ProfileTab } from '../ProfileTab.ts';

type ProfileTabLink = {
  id: ProfileTab | 'reviews' | 'likes' | 'network' | 'stats';
  href: string;
  label: string;
};

export function toProfileTabs(
  { slug, isMe }: { slug: string; isMe: boolean },
): ProfileTabLink[] {
  const profile = UrlBuilder.profile.user(slug);

  const tabs: ReadonlyArray<ProfileTabLink & { ownerOnly?: boolean }> = [
    { id: 'profile', href: profile, label: m.page_title_profile() },
    {
      id: 'diary',
      href: `${profile}/diary`,
      label: m.boxed_profile_tab_diary(),
    },
    { id: 'films', href: `${profile}/films`, label: m.label_stats_movies() },
    { id: 'shows', href: `${profile}/shows`, label: m.label_stats_shows() },
    {
      id: 'watching',
      href: `${profile}/watching`,
      label: m.boxed_profile_tab_watching(),
      ownerOnly: true,
    },
    {
      id: 'reviews',
      href: `${profile}?view=activity`,
      label: m.list_title_comments(),
      ownerOnly: true,
    },
    {
      id: 'watchlist',
      href: `${profile}/watchlist`,
      label: m.list_title_watchlist(),
      ownerOnly: true,
    },
    {
      id: 'lists',
      href: `${profile}/lists`,
      label: m.list_title_user_lists(),
    },
    {
      id: 'likes',
      href: UrlBuilder.profile.favorites(slug),
      label: m.boxed_profile_tab_likes(),
    },
    {
      id: 'network',
      href: UrlBuilder.profile.social(slug),
      label: m.header_network(),
    },
    {
      id: 'stats',
      href: UrlBuilder.users(slug).allTime(),
      label: m.boxed_profile_tab_stats(),
    },
  ];

  return tabs
    .filter((tab) => isMe || !tab.ownerOnly)
    .map(({ id, href, label }) => ({ id, href, label }));
}
