import type { AvailableLanguage } from '$lib/features/i18n/index.ts';
import { toHumanDuration } from '$lib/utils/formatting/date/toHumanDuration.ts';

type RuntimeMetaParams = {
  runtime: number;
  certification: string | Nil;
  locale: AvailableLanguage;
};

export function toRuntimeMeta(
  { runtime, certification, locale }: RuntimeMetaParams,
): string {
  return [
    Number.isFinite(runtime)
      ? toHumanDuration({ minutes: runtime }, locale)
      : null,
    certification,
  ].filter(Boolean).join(' · ');
}
