import { DRAWER_VIEW_PARAM } from '$lib/components/drawer/constants/index.ts';

type DrawerNavigationParams = {
  from: URL;
  to: URL;
};

export function isDrawerNavigation({ from, to }: DrawerNavigationParams) {
  if (from.origin !== to.origin) return false;
  if (from.pathname !== to.pathname) return false;

  return from.searchParams.has(DRAWER_VIEW_PARAM) ||
    to.searchParams.has(DRAWER_VIEW_PARAM);
}
