import CircularLogo from '$lib/components/icons/CircularLogo.svelte';
import IMDBSquareIcon from '$lib/components/icons/IMDBSquareIcon.svelte';
import LetterboxdIcon from '$lib/components/icons/LetterboxdIcon.svelte';
import TvTimeIcon from '$lib/components/icons/TvTimeIcon.svelte';
import * as m from '$lib/features/i18n/messages.ts';
import {
  IMPORT_SOURCE_CONFIGS,
  type ImportSource,
} from '$lib/sections/settings/import/ImportTypes.ts';
import type { Component } from 'svelte';

type ImportSourceCard = {
  source: ImportSource;
  icon: Component;
  name: () => string;
  description: () => string;
  accept: string;
  isFeatured: boolean;
};

export const importSourceCards: ReadonlyArray<ImportSourceCard> = [
  {
    source: 'letterboxd',
    icon: LetterboxdIcon,
    name: () => IMPORT_SOURCE_CONFIGS.letterboxd.name,
    description: m.welcome_import_letterboxd_description,
    accept: IMPORT_SOURCE_CONFIGS.letterboxd.accept,
    isFeatured: true,
  },
  {
    source: 'tvtime',
    icon: TvTimeIcon,
    name: () => IMPORT_SOURCE_CONFIGS.tvtime.name,
    description: m.boxed_import_tvtime_description,
    accept: IMPORT_SOURCE_CONFIGS.tvtime.accept,
    isFeatured: false,
  },
  {
    source: 'imdb',
    icon: IMDBSquareIcon,
    name: () => IMPORT_SOURCE_CONFIGS.imdb.name,
    description: m.welcome_import_imdb_description,
    accept: IMPORT_SOURCE_CONFIGS.imdb.accept,
    isFeatured: false,
  },
  {
    source: 'trakt-json',
    icon: CircularLogo,
    name: m.boxed_import_trakt_name,
    description: m.boxed_import_trakt_description,
    accept: IMPORT_SOURCE_CONFIGS['trakt-json'].accept,
    isFeatured: false,
  },
];
