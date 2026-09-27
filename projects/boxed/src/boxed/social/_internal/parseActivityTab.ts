const ACTIVITY_TABS = ['friends', 'you'] as const;

export type ActivityTab = typeof ACTIVITY_TABS[number];

export function parseActivityTab(value: string | Nil): ActivityTab {
  return ACTIVITY_TABS.find((tab) => tab === value) ?? 'friends';
}
