<script lang="ts">
  import type { DiscoverMode } from "$lib/features/filters/models/DiscoverMode.ts";
  import { useDiscover } from "$lib/features/filters/useDiscover.ts";
  import { useFilter } from "$lib/features/filters/useFilter.ts";
  import * as m from "$lib/features/i18n/messages.ts";
  import TraktPage from "$lib/sections/layout/TraktPage.svelte";
  import type { PaginatableStore } from "$lib/sections/lists/drilldown/PaginatableStore.ts";
  import NavbarStateSetter from "$lib/sections/navbar/NavbarStateSetter.svelte";
  import { DEFAULT_DRILL_SIZE } from "$lib/utils/constants.ts";
  import PageContainer from "../components/PageContainer.svelte";
  import type { PosterMedia } from "../poster/PosterMedia.ts";
  import BrowseHeader from "./BrowseHeader.svelte";
  import ChartGrid from "./ChartGrid.svelte";

  type ChartPageProps = {
    title: string;
    useList: PaginatableStore<PosterMedia, DiscoverMode>;
  };

  const { title, useList }: ChartPageProps = $props();

  const { mode } = useDiscover();
  const { filterMap } = useFilter();

  const { list, isLoading, hasNextPage, fetchNextPage } = $derived(
    useList({ type: $mode, limit: DEFAULT_DRILL_SIZE, filter: $filterMap }),
  );
</script>

<TraktPage audience="authenticated" {title} image={null} filterScope="global">
  <NavbarStateSetter hasFilters showFilters />
  <PageContainer>
    <BrowseHeader {title} />
    <ChartGrid
      {list}
      {isLoading}
      {hasNextPage}
      {fetchNextPage}
      emptyText={m.text_placeholder_generic()}
    />
  </PageContainer>
</TraktPage>
