export type ProfileTab =
  | 'profile'
  | 'activity'
  | 'films'
  | 'shows'
  | 'watchlist'
  | 'reviews'
  | 'network';

export const PROFILE_TABS: ReadonlyArray<ProfileTab> = [
  'profile',
  'activity',
  'films',
  'shows',
  'watchlist',
  'reviews',
  'network',
];

const isProfileTab = (value: string | null | undefined): value is ProfileTab =>
  value != null && (PROFILE_TABS as ReadonlyArray<string>).includes(value);

export function readProfileTab(search: URLSearchParams): ProfileTab {
  const raw = search.get('tab');
  return isProfileTab(raw) ? raw : 'profile';
}

export function writeProfileTab(url: URL, tab: ProfileTab): URL {
  const next = new URL(url.toString());
  if (tab === 'profile') next.searchParams.delete('tab');
  else next.searchParams.set('tab', tab);
  return next;
}
