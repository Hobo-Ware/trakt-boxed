import type { HistoryEntry } from '$lib/sections/lists/stores/models/HistoryEntry.ts';

function toItemKey(play: HistoryEntry): string {
  return play.type === 'movie'
    ? `movie-${play.movie.id}`
    : `episode-${play.episode.id}`;
}

export function findRewatches(
  plays: ReadonlyArray<HistoryEntry>,
): ReadonlySet<string> {
  const seen = new Set<string>();

  return plays.toReversed().reduce((rewatches, play) => {
    const itemKey = toItemKey(play);
    if (seen.has(itemKey)) rewatches.add(play.key);
    seen.add(itemKey);
    return rewatches;
  }, new Set<string>());
}
