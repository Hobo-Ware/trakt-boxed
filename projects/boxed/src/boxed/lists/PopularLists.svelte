<script lang="ts">
  import * as m from "$lib/features/i18n/messages.ts";
  import { useTrendingSearchesList } from "$lib/features/search/useTrendingSearchesList.ts";
  import type { MediaListSummary } from "$lib/requests/models/MediaListSummary.ts";
  import { map } from "rxjs";
  import ListCardGrid from "./ListCardGrid.svelte";

  const { list, isLoading } = useTrendingSearchesList("lists");
  const lists = list.pipe(
    map(($list) =>
      $list.filter((item): item is MediaListSummary => "posters" in item)
    ),
  );
</script>

<ListCardGrid
  lists={$isLoading ? null : $lists}
  skeletonCount={6}
  emptyText={m.text_placeholder_generic()}
/>
