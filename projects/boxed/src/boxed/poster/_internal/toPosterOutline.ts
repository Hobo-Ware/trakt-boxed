export type PosterOutline = 'watched' | 'watchlist' | 'none';

type PosterOutlineParams = {
  isWatched: boolean;
  isWatchlisted: boolean;
};

export function toPosterOutline(
  { isWatched, isWatchlisted }: PosterOutlineParams,
): PosterOutline {
  if (isWatched) return 'watched';
  if (isWatchlisted) return 'watchlist';

  return 'none';
}
