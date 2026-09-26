<script lang="ts">
  import ChartPage from "$boxed/browse/ChartPage.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import { usePopularList } from "$lib/sections/lists/popular/usePopularList.ts";
</script>

<ChartPage title={m.list_title_most_popular()} useList={usePopularList} />
