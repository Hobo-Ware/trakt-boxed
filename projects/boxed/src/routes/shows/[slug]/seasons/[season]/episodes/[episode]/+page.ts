import { episodeSummaryQuery } from '$lib/requests/queries/episode/episodeSummaryQuery.ts';
import { assertDefined } from '$lib/utils/assert/assertDefined.ts';
import { shouldPrefetch } from '$lib/utils/requests/shouldPrefetch.ts';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ parent, params, fetch, url }) => {
  const { queryClient, isBot } = await parent();

  if (!shouldPrefetch({ isBot, url })) return;

  await queryClient.prefetchQuery(
    episodeSummaryQuery({
      slug: assertDefined(params.slug, 'Slug is required'),
      season: parseInt(assertDefined(params.season, 'Season is required')),
      episode: parseInt(assertDefined(params.episode, 'Episode is required')),
      fetch,
    }),
  );
};
