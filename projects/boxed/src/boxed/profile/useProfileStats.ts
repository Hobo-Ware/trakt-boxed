import { useQuery } from '$lib/features/query/useQuery.ts';
import { userStatsQuery } from '$lib/requests/queries/users/userStatsQuery.ts';
import { toLoadingState } from '$lib/utils/requests/toLoadingState.ts';
import { map, type Observable } from 'rxjs';

export function useProfileStats(slug$: Observable<string>) {
  const query = useQuery(slug$.pipe(map((slug) => userStatsQuery({ slug }))));

  return {
    stats: query.pipe(map(($query) => $query.data ?? null)),
    isLoading: query.pipe(map(toLoadingState)),
  };
}
