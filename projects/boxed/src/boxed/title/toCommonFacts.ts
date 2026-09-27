import * as m from '$lib/features/i18n/messages.ts';
import type { AvailableLanguage } from '$lib/features/i18n/index.ts';
import type { MediaStudio } from '$lib/requests/models/MediaStudio.ts';
import { toCountryName } from '$lib/utils/formatting/intl/toCountryName.ts';
import { toLanguageName } from '$lib/utils/formatting/intl/toLanguageName.ts';
import type { TitleFact } from './TitleFact.ts';

type CommonFactsParams = {
  media: {
    title: string;
    originalTitle?: string | Nil;
    country?: string | Nil;
    languages?: ReadonlyArray<string> | Nil;
  };
  studios: ReadonlyArray<MediaStudio>;
  locale: AvailableLanguage;
};

type CommonFacts = {
  original: TitleFact | null;
  studio: TitleFact | null;
  country: TitleFact | null;
  language: TitleFact | null;
};

export function toCommonFacts(
  { media, studios, locale }: CommonFactsParams,
): CommonFacts {
  return {
    original: media.originalTitle && media.originalTitle !== media.title
      ? {
        key: 'original',
        label: m.header_original_title(),
        value: media.originalTitle,
      }
      : null,
    studio: studios.length > 0
      ? {
        key: 'studio',
        label: m.header_studio(),
        value: studios.map((studio) => studio.name).join(', '),
      }
      : null,
    country: media.country
      ? {
        key: 'country',
        label: m.header_country(),
        value: toCountryName(media.country, locale),
      }
      : null,
    language: media.languages?.length
      ? {
        key: 'language',
        label: m.header_language(),
        value: media.languages.map((code) => toLanguageName(code, locale))
          .join(', '),
      }
      : null,
  };
}
