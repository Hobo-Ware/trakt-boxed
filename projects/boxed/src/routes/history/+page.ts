import { withSearchParams } from '$boxed/utils/withSearchParams.ts';
import { redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';

const SYNC_PARAM = 'sync_id';

export const load: PageLoad = ({ url }) => {
  if (url.searchParams.has(SYNC_PARAM)) return;

  redirect(
    307,
    withSearchParams({
      path: '/profile/me/diary',
      search: url.searchParams,
      drop: ['page'],
    }),
  );
};
