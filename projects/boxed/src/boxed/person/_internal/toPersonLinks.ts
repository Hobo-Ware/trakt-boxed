import type { PersonSummary } from '$lib/requests/models/PersonSummary.ts';
import { UrlBuilder } from '$lib/utils/url/UrlBuilder.ts';

type PersonLink = { label: string; url: string };

export function toPersonLinks(
  person: PersonSummary,
): ReadonlyArray<PersonLink> {
  const { x, instagram, facebook, wikipedia } = person.socialMedia ?? {};
  const external = UrlBuilder.external;

  const links: ReadonlyArray<PersonLink | null> = [
    person.imdb
      ? { label: 'IMDb', url: external.imdb.person(person.imdb) }
      : null,
    wikipedia
      ? { label: 'Wikipedia', url: external.wikipedia(wikipedia) }
      : null,
    instagram
      ? { label: 'Instagram', url: external.instagram(instagram) }
      : null,
    x ? { label: 'X', url: external.x(x) } : null,
    facebook ? { label: 'Facebook', url: external.facebook(facebook) } : null,
  ];

  return links.filter((link): link is PersonLink => link !== null);
}
