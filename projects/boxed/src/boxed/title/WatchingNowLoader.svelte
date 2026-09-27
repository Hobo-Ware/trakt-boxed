<script lang="ts">
  import { useQuery } from "$lib/features/query/useQuery.ts";
  import { movieWatchersQuery } from "$lib/requests/queries/movies/movieWatchersQuery.ts";
  import { showWatchersQuery } from "$lib/requests/queries/shows/showWatchersQuery.ts";
  import { toLoadingState } from "$lib/utils/requests/toLoadingState.ts";
  import { fromRune } from "$lib/utils/store/fromRune.svelte.ts";
  import { map } from "rxjs";
  import WatchingNowList from "./WatchingNowList.svelte";

  const { slug, type }: { slug: string; type: "movie" | "show" } = $props();

  const query = useQuery(
    fromRune(() => ({ slug, type })).pipe(
      map((target) =>
        target.type === "movie"
          ? movieWatchersQuery({ slug: target.slug })
          : showWatchersQuery({ slug: target.slug })
      ),
    ),
  );

  const users = $derived(toLoadingState($query) ? null : ($query.data ?? []));
</script>

<WatchingNowList {users} />
