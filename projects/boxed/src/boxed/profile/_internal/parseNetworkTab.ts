import type { ProfileSocialListType } from '$lib/sections/profile/models/ProfileSocialListType.ts';

const NETWORK_TABS = [
  'following',
  'followers',
  'requests',
] as const satisfies ReadonlyArray<ProfileSocialListType>;

export function parseNetworkTab(
  { value, isMe }: { value: string | Nil; isMe: boolean },
): ProfileSocialListType {
  const tab = NETWORK_TABS.find((candidate) => candidate === value);
  if (tab === 'requests' && !isMe) return 'following';

  return tab ?? 'following';
}
