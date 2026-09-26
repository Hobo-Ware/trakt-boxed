<script lang="ts">
  import * as m from "$lib/features/i18n/messages.ts";
  import { useRecommendedList } from "$lib/sections/lists/recommended/useRecommendedList.ts";
  import PosterRow from "../../poster/PosterRow.svelte";

  const { list, isLoading } = useRecommendedList({ type: "media", limit: 12 });
</script>

<PosterRow
  label={m.list_title_recommended()}
  emptyText={m.text_placeholder_generic()}
  items={$isLoading ? null : $list}
/>
