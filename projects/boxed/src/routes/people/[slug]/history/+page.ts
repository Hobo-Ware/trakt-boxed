import { redirectPath } from '$boxed/utils/redirectPath.ts';
import { redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = ({ params, url }) =>
  redirect(
    307,
    redirectPath({
      path: `/people/${encodeURIComponent(params.slug)}`,
      search: url.searchParams,
    }),
  );
