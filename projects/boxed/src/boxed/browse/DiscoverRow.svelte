<script lang="ts">
  import type { DiscoverMode } from "$lib/features/filters/models/DiscoverMode.ts";
  import { useDiscover } from "$lib/features/filters/useDiscover.ts";
  import { useFilter } from "$lib/features/filters/useFilter.ts";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { PaginatableStore } from "$lib/sections/lists/drilldown/PaginatableStore.ts";
  import PosterRow from "../poster/PosterRow.svelte";
  import type { PosterMedia } from "../poster/PosterMedia.ts";

  type DiscoverRowProps = {
    label: string;
    useList: PaginatableStore<PosterMedia, DiscoverMode>;
  };

  const { label, useList }: DiscoverRowProps = $props();

  const { mode } = useDiscover();
  const { filterMap } = useFilter();

  const { list, isLoading } = $derived(
    useList({ type: $mode, limit: 12, filter: $filterMap }),
  );
</script>

<PosterRow
  {label}
  items={$isLoading ? null : $list}
  showUserMeta
  emptyText={m.text_placeholder_generic()}
/>
