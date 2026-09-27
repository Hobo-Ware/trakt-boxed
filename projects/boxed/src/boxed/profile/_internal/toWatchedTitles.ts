import type { HistoryEntry } from '$lib/sections/lists/stores/models/HistoryEntry.ts';
import type { PosterMedia } from '../../poster/PosterMedia.ts';

function toTitle(play: HistoryEntry): PosterMedia {
  return play.type === 'movie'
    ? { ...play.movie, type: 'movie' }
    : { ...play.show, type: 'show' };
}

export function toWatchedTitles(
  plays: ReadonlyArray<HistoryEntry>,
): PosterMedia[] {
  const titles = new Map<string, PosterMedia>();

  plays.map(toTitle).forEach((title) => {
    if (!titles.has(title.key)) titles.set(title.key, title);
  });

  return [...titles.values()];
}
