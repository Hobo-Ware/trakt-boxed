<script lang="ts">
  import * as m from "$lib/features/i18n/messages.ts";
  import { useWatchList } from "$lib/sections/lists/watchlist/useWatchList.ts";
  import { map } from "rxjs";
  import PosterRow from "../../poster/PosterRow.svelte";

  const { list, isLoading } = useWatchList({
    type: "media",
    intent: "start",
    limit: 12,
  });
  const posters = list.pipe(map(($list) => $list.map((item) => item.entry)));
</script>

<PosterRow
  label={m.list_title_start_watching()}
  emptyText={m.text_placeholder_generic()}
  items={$isLoading ? null : $posters}
/>
