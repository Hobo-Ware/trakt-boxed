import type { DiaryEntry } from '../DiaryEntry.ts';

export function toEntryTitle(entry: DiaryEntry): string {
  return entry.type === 'movie' ? entry.play.movie.title : entry.show.title;
}
