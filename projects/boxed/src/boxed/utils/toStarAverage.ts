import type {
  AvailableLanguage,
  AvailableLocale,
} from '$lib/features/i18n/index.ts';
import { toIMDBRating } from '$lib/utils/formatting/number/toIMDBRating.ts';

const STAR_SCALE = 5;

export function toStarAverage(
  rating: number,
  locale: AvailableLocale | AvailableLanguage,
): string {
  return toIMDBRating(rating * STAR_SCALE, locale);
}
