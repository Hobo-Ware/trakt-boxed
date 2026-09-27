import { UrlBuilder } from '$lib/utils/url/UrlBuilder.ts';

type ProfileLinkTarget = {
  slug?: string | Nil;
  username: string;
};

export function toProfileHref(user: ProfileLinkTarget): string {
  return UrlBuilder.profile.user(user.slug ?? user.username);
}
