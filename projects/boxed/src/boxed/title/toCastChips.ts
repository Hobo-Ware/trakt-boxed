import type { CastMember } from '$lib/requests/models/MediaCrew.ts';
import { UrlBuilder } from '$lib/utils/url/UrlBuilder.ts';
import type { TitleChip } from './TitleChip.ts';

export function toCastChips(
  cast: ReadonlyArray<CastMember>,
  limit: number,
): ReadonlyArray<TitleChip> {
  return cast.slice(0, limit).map((member) => ({
    key: member.key,
    label: member.name,
    href: UrlBuilder.people(member.key),
  }));
}
