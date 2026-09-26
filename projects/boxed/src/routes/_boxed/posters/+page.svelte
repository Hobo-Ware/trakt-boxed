<script lang="ts">
  import PageContainer from "$boxed/components/PageContainer.svelte";
  import SectionHeader from "$boxed/components/SectionHeader.svelte";
  import PosterGrid from "$boxed/poster/PosterGrid.svelte";
  import { logComposerStore } from "$boxed/log/logComposerStore.ts";
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

  const firstMovie = $derived($movies.at(0));
  const firstShow = $derived($shows.at(0));
</script>

<TraktPage audience="all" title="Posters" image={null} isIndexable={false}>
<PageContainer>
  <div class="boxed-preview-actions">
    <button
      type="button"
      data-testid="open-film-log"
      onclick={() => firstMovie && logComposerStore.compose({ type: "movie", media: firstMovie })}
    >
      Log a film
    </button>
    <button
      type="button"
      data-testid="open-episode-log"
      onclick={() => firstShow && logComposerStore.compose({ type: "show", media: firstShow })}
    >
      Log episodes
    </button>
    <button type="button" data-testid="open-log-picker" onclick={logComposerStore.openPicker}>
      Picker
    </button>
  </div>
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


<style>
  .boxed-preview-actions {
    display: flex;
    gap: var(--gap-s);
  }
</style>
