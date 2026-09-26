<script lang="ts">
  import BrowseHeader from "$boxed/browse/BrowseHeader.svelte";
  import DiscoverRow from "$boxed/browse/DiscoverRow.svelte";
  import InView from "$boxed/components/InView.svelte";
  import PageContainer from "$boxed/components/PageContainer.svelte";
  import SectionHeader from "$boxed/components/SectionHeader.svelte";
  import PosterRow from "$boxed/poster/PosterRow.svelte";
  import { GENRES } from "$lib/features/filters/genres.ts";
  import { useDiscover } from "$lib/features/filters/useDiscover.ts";
  import * as m from "$lib/features/i18n/messages.ts";
  import SeasonalToggle from "$lib/features/theme/components/SeasonalToggle.svelte";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import TraktPage from "$lib/sections/layout/TraktPage.svelte";
  import { useAnticipatedList } from "$lib/sections/lists/anticipated/useAnticipatedList.ts";
  import { usePopularList } from "$lib/sections/lists/popular/usePopularList.ts";
  import { useRecommendedList } from "$lib/sections/lists/recommended/useRecommendedList.ts";
  import { useTrendingList } from "$lib/sections/lists/trending/useTrendingList.ts";
  import NavbarStateSetter from "$lib/sections/navbar/NavbarStateSetter.svelte";
  import { DEFAULT_SHARE_SHOW_COVER } from "$lib/utils/assets";
  import { toTranslatedGenre } from "$lib/utils/formatting/string/toTranslatedGenre.ts";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";

  const { mode, useSeasonalFilters } = useDiscover();

  const title = $derived.by(() => {
    switch ($mode) {
      case "show":
        return m.page_title_shows();
      case "movie":
        return m.page_title_movies();
      default:
        return m.page_title_discover();
    }
  });

  const overview = $derived.by(() => {
    switch ($mode) {
      case "show":
        return m.page_description_shows();
      case "movie":
        return m.page_description_movies();
      default:
        return m.page_description_media();
    }
  });

  const genreHref = (genre: string) => {
    const url = new URL(UrlBuilder.popular({ mode: $mode }), "https://trakt.tv");
    url.searchParams.set("genres", genre);
    return `${url.pathname}${url.search}`;
  };

  const chartHref = (
    build: (params: { mode: typeof $mode }) => string,
  ) => build({ mode: $mode });
</script>

{#snippet lazyRow(label: string, href: string)}
  <SectionHeader title={label} {href} />
  <PosterRow {label} items={null} showUserMeta />
{/snippet}

<TraktPage
  audience="all"
  image={DEFAULT_SHARE_SHOW_COVER}
  {title}
  info={{ overview }}
  filterScope="global"
>
  <NavbarStateSetter hasFilters={!$useSeasonalFilters} showFilters />

  <PageContainer>
    <BrowseHeader {title}>
      {#snippet actions()}
        <SeasonalToggle />
      {/snippet}
    </BrowseHeader>

    <section>
      <SectionHeader
        title={m.list_title_trending()}
        href={chartHref(UrlBuilder.trending)}
      />
      <DiscoverRow label={m.list_title_trending()} useList={useTrendingList} />
    </section>

    <section>
      <InView>
        <SectionHeader
          title={m.list_title_most_popular()}
          href={chartHref(UrlBuilder.popular)}
        />
        <DiscoverRow label={m.list_title_most_popular()} useList={usePopularList} />
        {#snippet placeholder()}
          {@render lazyRow(m.list_title_most_popular(), chartHref(UrlBuilder.popular))}
        {/snippet}
      </InView>
    </section>

    <section>
      <InView>
        <SectionHeader
          title={m.list_title_most_anticipated()}
          href={chartHref(UrlBuilder.anticipated)}
        />
        <DiscoverRow
          label={m.list_title_most_anticipated()}
          useList={useAnticipatedList}
        />
        {#snippet placeholder()}
          {@render lazyRow(
            m.list_title_most_anticipated(),
            chartHref(UrlBuilder.anticipated),
          )}
        {/snippet}
      </InView>
    </section>

    <RenderFor audience="authenticated">
      <section>
        <InView>
          <SectionHeader
            title={m.list_title_recommended()}
            href={chartHref(UrlBuilder.recommended)}
          />
          <DiscoverRow
            label={m.list_title_recommended()}
            useList={useRecommendedList}
          />
          {#snippet placeholder()}
            {@render lazyRow(
              m.list_title_recommended(),
              chartHref(UrlBuilder.recommended),
            )}
          {/snippet}
        </InView>
      </section>
    </RenderFor>

    <section>
      <SectionHeader title={m.boxed_browse_by_genre()} />
      <ul class="boxed-genres">
        {#each GENRES as genre (genre)}
          <li>
            <a href={genreHref(genre)}>
              {toTranslatedGenre(genre)}
            </a>
          </li>
        {/each}
      </ul>
    </section>
  </PageContainer>
</TraktPage>

<style>
  .boxed-genres {
    margin: 0;
    padding: 0;
    list-style: none;

    display: flex;
    flex-wrap: wrap;
    gap: var(--gap-xs);

    a {
      display: inline-flex;
      align-items: center;
      height: var(--ni-36);
      padding-inline: var(--ni-14);

      border-radius: var(--border-radius-xxl);
      background: var(--color-input-background);
      box-shadow: inset 0 0 0 var(--border-thickness-xxs) var(--color-border);
      color: var(--color-text-primary);
      font-size: var(--ni-14);
      text-decoration: none;

      &:hover,
      &:focus-visible {
        box-shadow: inset 0 0 0 var(--border-thickness-xxs) var(--purple-400);
      }
    }
  }
</style>
