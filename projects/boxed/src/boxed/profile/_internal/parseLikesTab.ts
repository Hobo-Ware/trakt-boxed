const LIKES_TABS = ['movie', 'show', 'lists'] as const;

export type LikesTab = typeof LIKES_TABS[number];

type ParseLikesTabParams = {
  tab: string | Nil;
  mode: string | Nil;
  isMe: boolean;
};

export function parseLikesTab(
  { tab, mode, isMe }: ParseLikesTabParams,
): LikesTab {
  const value = LIKES_TABS.find((candidate) => candidate === (tab ?? mode));
  if (value === 'lists' && !isMe) return 'movie';

  return value ?? 'movie';
}
