import { getIntlLocale } from '$lib/features/i18n/index.ts';
import type {
  AvailableLanguage,
  AvailableLocale,
} from '$lib/features/i18n/index.ts';

const UNITS: ReadonlyArray<[Intl.RelativeTimeFormatUnit, number]> = [
  ['day', 24 * 60 * 60],
  ['hour', 60 * 60],
  ['minute', 60],
];

export function toTimeAgo(
  now: Date,
  date: Date,
  locale: AvailableLocale | AvailableLanguage,
): string {
  const seconds = Math.round((date.getTime() - now.getTime()) / 1000);
  const formatter = new Intl.RelativeTimeFormat(getIntlLocale(locale), {
    numeric: 'auto',
  });

  for (const [unit, size] of UNITS) {
    if (Math.abs(seconds) >= size) {
      return formatter.format(Math.round(seconds / size), unit);
    }
  }

  return formatter.format(0, 'minute');
}
