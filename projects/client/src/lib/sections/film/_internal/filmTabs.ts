export type FilmTab =
  | 'cast'
  | 'crew'
  | 'details'
  | 'genres'
  | 'releases'
  | 'related'
  | 'reviews';

export const FILM_TABS: ReadonlyArray<FilmTab> = [
  'cast',
  'crew',
  'details',
  'genres',
  'releases',
  'related',
  'reviews',
];

const isFilmTab = (value: string | null | undefined): value is FilmTab =>
  value != null && (FILM_TABS as ReadonlyArray<string>).includes(value);

export function readTabFromUrl(search: URLSearchParams, fallback: FilmTab = 'cast'): FilmTab {
  const raw = search.get('tab');
  return isFilmTab(raw) ? raw : fallback;
}

export function writeTabToUrl(url: URL, tab: FilmTab): URL {
  const next = new URL(url.toString());
  if (tab === 'cast') {
    next.searchParams.delete('tab');
  } else {
    next.searchParams.set('tab', tab);
  }
  return next;
}
