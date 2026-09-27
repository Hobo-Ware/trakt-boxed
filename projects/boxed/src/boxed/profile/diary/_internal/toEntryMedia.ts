import type { PosterMedia } from '../../../poster/PosterMedia.ts';
import type { DiaryEntry } from '../DiaryEntry.ts';

export function toEntryMedia(entry: DiaryEntry): PosterMedia {
  return entry.type === 'movie'
    ? { ...entry.play.movie, type: 'movie' }
    : { ...entry.show, type: 'show' };
}
