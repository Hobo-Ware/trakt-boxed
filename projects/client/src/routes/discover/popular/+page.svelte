<script lang="ts">
  import ShareButton from "$lib/components/buttons/share/ShareButton.svelte";
  import { useDiscover } from "$lib/features/discover/useDiscover";
  import { useFilter } from "$lib/features/filters/useFilter";
  import * as m from "$lib/features/i18n/messages";
  import FilmsPosterGrid from "$lib/sections/films/FilmsPosterGrid.svelte";
  import TraktPage from "$lib/sections/layout/TraktPage.svelte";
  import TraktPageCoverSetter from "$lib/sections/layout/TraktPageCoverSetter.svelte";
  import { usePopularList } from "$lib/sections/lists/popular/usePopularList";
  import NavbarStateSetter from "$lib/sections/navbar/NavbarStateSetter.svelte";
  import { DEFAULT_SHARE_MOVIE_COVER } from "$lib/utils/assets";

  const { mode, current } = useDiscover();
  const { filterMap } = useFilter();

  const { list, hasNextPage, fetchNextPage } = $derived(
    usePopularList({ type: $mode, filter: $filterMap }),
  );
</script>

{#snippet actions()}
  <ShareButton
    title={m.list_title_most_popular()}
    textFactory={({ title: name }) => m.text_share_top_list({ name })}
    source={{ id: "popular", type: $mode }}
  />
{/snippet}

<TraktPage
  audience="authenticated"
  image={DEFAULT_SHARE_MOVIE_COVER}
  title={m.page_title_popular_media()}
>
  <NavbarStateSetter
    hasFilters
    header={{
      title: m.list_title_most_popular(),
      metaInfo: $current.text(),
      actions,
    }}
  />

  <TraktPageCoverSetter />

  <FilmsPosterGrid
    items={$list ?? []}
    hasNextPage={$hasNextPage}
    onLoadMore={fetchNextPage}
  />
</TraktPage>
