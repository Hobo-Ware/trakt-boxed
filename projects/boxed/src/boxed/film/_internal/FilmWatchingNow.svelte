<script lang="ts">
  import { useQuery } from "$lib/features/query/useQuery.ts";
  import { movieWatchersQuery } from "$lib/requests/queries/movies/movieWatchersQuery.ts";
  import { toLoadingState } from "$lib/utils/requests/toLoadingState.ts";
  import { fromRune } from "$lib/utils/store/fromRune.svelte.ts";
  import { map } from "rxjs";
  import WatchingNowList from "../../title/WatchingNowList.svelte";

  const { slug }: { slug: string } = $props();

  const query = useQuery(
    fromRune(() => slug).pipe(map((value) => movieWatchersQuery({ slug: value }))),
  );

  const users = $derived(toLoadingState($query) ? null : ($query.data ?? []));
</script>

<WatchingNowList {users} />
