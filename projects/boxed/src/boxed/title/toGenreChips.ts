import { toTranslatedGenre } from '$lib/utils/formatting/string/toTranslatedGenre.ts';
import type { TitleChip } from './TitleChip.ts';

export function toGenreChips(
  genres: ReadonlyArray<string>,
): ReadonlyArray<TitleChip> {
  return genres.map((genre) => ({
    key: genre,
    label: toTranslatedGenre(genre),
  }));
}
