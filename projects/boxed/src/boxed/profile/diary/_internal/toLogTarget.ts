import type { LogTarget } from '../../../log/LogTarget.ts';
import type { DiaryEntry } from '../DiaryEntry.ts';

export function toLogTarget(entry: DiaryEntry): LogTarget {
  if (entry.type === 'movie') {
    return { type: 'movie', media: entry.play.movie };
  }

  const last = entry.plays.at(-1)?.episode;

  return {
    type: 'show',
    media: entry.show,
    season: last?.season,
    episode: last?.number,
  };
}
