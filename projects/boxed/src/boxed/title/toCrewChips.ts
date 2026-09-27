import type { CrewMember } from '$lib/requests/models/MediaCrew.ts';
import { toTranslatedJob } from '$lib/utils/formatting/string/toTranslatedJob.ts';
import { UrlBuilder } from '$lib/utils/url/UrlBuilder.ts';
import type { TitleChip } from './TitleChip.ts';

export function toCrewChips(
  members: ReadonlyArray<CrewMember>,
): ReadonlyArray<TitleChip> {
  return members.map((member) => ({
    key: `${member.key}-${member.jobs.join('-')}`,
    label: member.name,
    detail: member.jobs.map((job) => toTranslatedJob(job)).join(', '),
    href: UrlBuilder.people(member.key),
  }));
}
