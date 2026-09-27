import { redirectPath } from '$boxed/utils/redirectPath.ts';
import { redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';

const SYNC_PARAM = 'sync_id';

export const load: PageLoad = ({ url }) => {
  if (url.searchParams.has(SYNC_PARAM)) return;

  redirect(
    307,
    redirectPath({
      path: '/profile/me/diary',
      search: url.searchParams,
      drop: ['page'],
    }),
  );
};
