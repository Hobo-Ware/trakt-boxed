<script lang="ts">
  import * as m from "$lib/features/i18n/messages.ts";
  import { usePopularList } from "$lib/sections/lists/popular/usePopularList.ts";
  import PosterRow from "../../poster/PosterRow.svelte";

  const { list, isLoading } = usePopularList({ type: "media", limit: 12 });
</script>

<PosterRow
  label={m.list_title_most_popular()}
  emptyText={m.text_placeholder_generic()}
  items={$isLoading ? null : $list}
/>
