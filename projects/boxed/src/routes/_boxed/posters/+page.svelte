<script lang="ts">
  import PageContainer from "$boxed/components/PageContainer.svelte";
  import SectionHeader from "$boxed/components/SectionHeader.svelte";
  import PosterGrid from "$boxed/poster/PosterGrid.svelte";
  import PosterRow from "$boxed/poster/PosterRow.svelte";
  import TraktPage from "$lib/sections/layout/TraktPage.svelte";
  import { useTrendingList } from "$lib/sections/lists/trending/useTrendingList.ts";

  const { list: movies, isLoading: isLoadingMovies } = useTrendingList({
    type: "movie",
    limit: 12,
    page: 1,
  });
  const { list: shows, isLoading: isLoadingShows } = useTrendingList({
    type: "show",
    limit: 12,
    page: 1,
  });
</script>

<TraktPage audience="all" title="Posters" image={null} isIndexable={false}>
<PageContainer>
  <section>
    <SectionHeader title="Trending movies" href="/discover?mode=movie" />
    <PosterRow label="Trending movies" items={$isLoadingMovies ? null : $movies} showUserMeta />
  </section>

  <section>
    <SectionHeader title="Trending shows" />
    <PosterGrid items={$isLoadingShows ? null : $shows} columns={6} showUserMeta />
  </section>

  <section>
    <SectionHeader title="Loading state" />
    <PosterGrid items={null} columns={6} skeletonCount={6} showUserMeta />
  </section>
</PageContainer>
</TraktPage>

