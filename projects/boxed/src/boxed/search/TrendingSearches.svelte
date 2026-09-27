<script lang="ts">
  import type { SearchItem } from "$lib/features/search/models/SearchItem.ts";
  import { useTrendingSearchesList } from "$lib/features/search/useTrendingSearchesList.ts";
  import type { SearchMode } from "$lib/requests/queries/search/models/SearchMode.ts";
  import { untrack, type Snippet } from "svelte";

  type TrendingSearchesProps = {
    mode: SearchMode;
    children: Snippet<[ReadonlyArray<SearchItem> | null]>;
  };

  const { mode, children }: TrendingSearchesProps = $props();

  const { list, isLoading } = useTrendingSearchesList(untrack(() => mode));
</script>

{@render children($isLoading ? null : $list)}
