/*
  Derive the personal status of a media for the 3-state poster outline:
  watched / watchlist / none. Reads from useUser() so the state stays
  reactive when the user logs activity.

  Reference: ../../../../letterboxd-research/notes/SUMMARY.md — every
  poster carries a green/blue/white outline encoding personal status
  without taking layout space.
*/
import { useUser } from '$lib/features/auth/stores/useUser.ts';
import type { MediaType } from '$lib/requests/models/MediaType.ts';
import { combineLatest, map } from 'rxjs';

export type MediaWatchState = 'watched' | 'watchlist' | 'none';

type UseMediaWatchStateProps = {
  type: MediaType;
  id: number;
};

export function useMediaWatchState({ type, id }: UseMediaWatchStateProps) {
  const { history, watchlist } = useUser();

  const state$ = combineLatest([history, watchlist]).pipe(
    map(([h, w]): MediaWatchState => {
      if (type === 'movie') {
        if (h.movies.has(id)) return 'watched';
        if (w.movies.has(id)) return 'watchlist';
        return 'none';
      }

      if (h.shows.has(id)) return 'watched';
      if (w.shows.has(id)) return 'watchlist';
      return 'none';
    }),
  );

  return { state: state$ };
}
