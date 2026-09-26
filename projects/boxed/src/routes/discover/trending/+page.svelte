<script lang="ts">
  import ChartPage from "$boxed/browse/ChartPage.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import { useTrendingList } from "$lib/sections/lists/trending/useTrendingList.ts";
</script>

<ChartPage title={m.list_title_trending()} useList={useTrendingList} />
