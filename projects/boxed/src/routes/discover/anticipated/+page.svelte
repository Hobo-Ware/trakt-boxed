<script lang="ts">
  import ChartPage from "$boxed/browse/ChartPage.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import { useAnticipatedList } from "$lib/sections/lists/anticipated/useAnticipatedList.ts";
</script>

<ChartPage title={m.list_title_most_anticipated()} useList={useAnticipatedList} />
