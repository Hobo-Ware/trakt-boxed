import * as m from '$lib/features/i18n/messages.ts';
import type { EpisodeType } from '$lib/requests/models/EpisodeType.ts';

const LABELS: Partial<Record<EpisodeType, () => string>> = {
  series_premiere: m.tag_text_series_premiere,
  season_premiere: m.tag_text_season_premiere,
  mid_season_premiere: m.tag_text_mid_season_premiere,
  series_finale: m.tag_text_series_finale,
  season_finale: m.tag_text_season_finale,
  mid_season_finale: m.tag_text_mid_season_finale,
};

export function toEpisodeTypeLabel(type: EpisodeType): string | null {
  return LABELS[type]?.() ?? null;
}
