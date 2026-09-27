import { withSearchParams } from '$boxed/utils/withSearchParams.ts';
import { redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = ({ params, url }) =>
  redirect(
    307,
    withSearchParams({
      path: `/profile/${encodeURIComponent(params.slug)}/watching`,
      search: url.searchParams,
      set: { tab: 'in-progress' },
    }),
  );
