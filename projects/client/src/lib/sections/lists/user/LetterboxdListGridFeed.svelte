<script lang="ts">
  /*
    Wrapper that owns the useListItems subscription and feeds the
    leaf LetterboxdListGrid. Subscribes at component scope so
    Svelte's "stores must be top-level" rule is honoured (the
    pre-existing trakt-web pages tripped that rule by trying to
    subscribe inside @const inside a snippet — this component
    sidesteps that entirely).
  */
  import type { DiscoverMode } from "$lib/features/discover/models/DiscoverMode";
  import { useFilter } from "$lib/features/filters/useFilter";
  import type { MediaListSummary } from "$lib/requests/models/MediaListSummary";
  import LetterboxdListGrid from "./LetterboxdListGrid.svelte";
  import type { SortBy } from "./models/SortBy";
  import { useListItems } from "./useListItems";

  type LetterboxdListGridFeedProps = {
    list: MediaListSummary;
    type?: DiscoverMode;
    sortBy: SortBy;
    sortHow: "asc" | "desc";
  };

  const { list, type, sortBy, sortHow }: LetterboxdListGridFeedProps =
    $props();

  const { filterMap } = useFilter();

  const query = $derived(
    useListItems({
      list,
      type: type === "media" ? undefined : type,
      sortBy,
      sortHow,
      filter: $filterMap,
      limit: 60,
    }),
  );

  const items = $derived(query.list);
  const hasNextPage = $derived(query.hasNextPage);
</script>

<LetterboxdListGrid
  items={$items}
  hasNextPage={$hasNextPage}
  onLoadMore={query.fetchNextPage}
/>
