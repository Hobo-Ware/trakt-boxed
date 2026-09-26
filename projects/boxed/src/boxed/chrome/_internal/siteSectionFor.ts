export type SiteSection = 'movies' | 'shows' | 'lists' | 'calendar';

type SiteSectionParams = {
  pathname: string;
  discoverMode: string | null;
};

const LIST_PATH =
  /^\/(lists|users\/[^/]+\/lists|users\/[^/]+\/watchlist)(\/|$)/;

export function siteSectionFor(
  { pathname, discoverMode }: SiteSectionParams,
): SiteSection | null {
  if (pathname.startsWith('/movies')) return 'movies';
  if (pathname.startsWith('/shows')) return 'shows';
  if (pathname.startsWith('/calendar')) return 'calendar';
  if (LIST_PATH.test(pathname)) return 'lists';
  if (!pathname.startsWith('/discover')) return null;
  if (discoverMode === 'movie') return 'movies';
  if (discoverMode === 'show') return 'shows';

  return null;
}
