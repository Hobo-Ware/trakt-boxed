import type { PersonalListType } from '$lib/sections/lists/user/models/PersonalListType.ts';

const LIST_TABS = [
  'personal',
  'collaboration',
  'liked',
] as const satisfies ReadonlyArray<PersonalListType>;

export function parseListsTab(
  { value, isMe }: { value: string | Nil; isMe: boolean },
): PersonalListType {
  const tab = LIST_TABS.find((candidate) => candidate === value);
  if (tab === 'liked' && !isMe) return 'personal';

  return tab ?? 'personal';
}
