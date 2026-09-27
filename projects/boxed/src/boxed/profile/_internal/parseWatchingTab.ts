export const WATCHING_TABS = [
  'up-next',
  'in-progress',
  'start-watching',
  'dropped',
  'completed',
] as const;

export type WatchingTab = typeof WATCHING_TABS[number];

export function parseWatchingTab(value: string | Nil): WatchingTab {
  return WATCHING_TABS.find((tab) => tab === value) ?? 'up-next';
}
