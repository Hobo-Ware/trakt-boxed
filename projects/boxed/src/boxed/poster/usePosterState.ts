import { toMediaTarget } from './toMediaTarget.ts';
import { useUser } from '$lib/features/auth/stores/useUser.ts';
import { useIsWatched } from '$lib/sections/media-actions/mark-as-watched/useIsWatched.ts';
import { useIsWatchlisted } from '$lib/stores/useIsWatchlisted.ts';
import { getShowWatchState } from '$lib/utils/media/getShowWatchState.ts';
import { combineLatest, map } from 'rxjs';
import { toPosterOutline } from './_internal/toPosterOutline.ts';
import { toShowProgress } from './_internal/toShowProgress.ts';
import type { PosterMedia } from './PosterMedia.ts';

export function usePosterState(media: PosterMedia) {
  const target = toMediaTarget(media);

  const { isWatched } = useIsWatched(target);
  const { isWatchlisted } = useIsWatchlisted(target);
  const { history, ratings, favorites } = useUser();

  const outline = combineLatest([isWatched, isWatchlisted]).pipe(
    map(([$isWatched, $isWatchlisted]) =>
      toPosterOutline({
        isWatched: $isWatched,
        isWatchlisted: $isWatchlisted,
      })
    ),
  );

  const progress = history.pipe(
    map(($history) => {
      if (media.type !== 'show') return null;

      const state = getShowWatchState({
        watchedShow: $history?.shows.get(media.id),
        episodeCount: media.episode?.count,
      });

      return toShowProgress({
        watchedEpisodeCount: state.watchedEpisodeCount,
        episodeCount: media.episode?.count,
        isWatched: state.isWatched,
      });
    }),
  );

  const rating = ratings.pipe(
    map(($ratings) => {
      const rated = media.type === 'movie' ? $ratings?.movies : $ratings?.shows;
      return rated?.get(media.id)?.rating ?? null;
    }),
  );

  const isLiked = favorites.pipe(
    map(($favorites) => {
      const liked = media.type === 'movie'
        ? $favorites?.movies
        : $favorites?.shows;
      return liked?.has(media.id) ?? false;
    }),
  );

  return { outline, progress, rating, isLiked };
}
