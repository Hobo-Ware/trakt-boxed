import { withSearchParams } from '$boxed/utils/withSearchParams.ts';
import { redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = ({ params, url }) =>
  redirect(
    307,
    withSearchParams({
      path: `/profile/${encodeURIComponent(params.user)}/watching`,
      search: url.searchParams,
    }),
  );
