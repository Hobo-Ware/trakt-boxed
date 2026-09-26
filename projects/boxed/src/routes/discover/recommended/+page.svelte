<script lang="ts">
  import ChartPage from "$boxed/browse/ChartPage.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import { useRecommendedList } from "$lib/sections/lists/recommended/useRecommendedList.ts";
</script>

<ChartPage title={m.list_title_recommended()} useList={useRecommendedList} />
