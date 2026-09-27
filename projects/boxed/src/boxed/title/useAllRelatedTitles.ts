import { createBulkMediaIntl } from '$lib/features/intl-overlay/createBulkMediaIntl.ts';
import { withOverlayLoading } from '$lib/features/intl-overlay/withOverlayLoading.ts';
import { flattenQueryPages } from '$lib/features/query/flattenQueryPages.ts';
import type { InfiniteQuery } from '$lib/features/query/models/InfiniteQuery.ts';
import { useAllPagesInfiniteQuery } from '$lib/features/query/useQuery.ts';
import type { MediaType } from '$lib/requests/models/MediaType.ts';
import { movieRelatedQuery } from '$lib/requests/queries/movies/movieRelatedQuery.ts';
import { showRelatedQuery } from '$lib/requests/queries/shows/showRelatedQuery.ts';
import type { RelatedEntry } from '$lib/sections/lists/stores/useRelatedList.ts';
import { DEFAULT_RELATED_LIMIT } from '$lib/utils/constants.ts';
import { toLoadingState } from '$lib/utils/requests/toLoadingState.ts';
import { map } from 'rxjs';
import { uniqueByKey } from '../utils/uniqueByKey.ts';

type AllRelatedTitlesProps = {
  slug: string;
  type: MediaType;
};

function typeToQuery({ slug, type }: AllRelatedTitlesProps) {
  const params = { slug, limit: DEFAULT_RELATED_LIMIT };

  switch (type) {
    case 'movie':
      return movieRelatedQuery(params) as InfiniteQuery<RelatedEntry>;
    case 'show':
      return showRelatedQuery(params) as InfiniteQuery<RelatedEntry>;
  }
}

export function useAllRelatedTitles(props: AllRelatedTitlesProps) {
  const query = useAllPagesInfiniteQuery(typeToQuery(props));
  const overlay = createBulkMediaIntl<RelatedEntry>();

  const baseLoading = query.pipe(
    map(($query) => toLoadingState($query) || $query.hasNextPage),
  );

  return {
    list: query.pipe(
      map(($query) =>
        uniqueByKey(flattenQueryPages($query), (item) => item.key)
      ),
      overlay.operator,
    ),
    isLoading: withOverlayLoading(baseLoading, overlay.intlLoading$),
  };
}
