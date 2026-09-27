<script lang="ts">
  import { page } from "$app/state";
  import { languageTag } from "$lib/features/i18n/index.ts";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { MediaStats } from "$lib/requests/models/MediaStats.ts";
  import { toHumanNumber } from "$lib/utils/formatting/number/toHumanNumber.ts";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder.ts";
  import type { Snippet } from "svelte";
  import type { PosterMedia } from "../poster/PosterMedia.ts";
  import { toReviewHref } from "../review/toReviewHref.ts";
  import ListsLoader from "./_internal/ListsLoader.svelte";
  import { parseTitleTab } from "./_internal/parseTitleTab.ts";
  import { toAmbientColors } from "./toAmbientColors.ts";
  import ReviewsTab from "./ReviewsTab.svelte";
  import TitleCompactHeader from "./TitleCompactHeader.svelte";
  import TitleFacetLayout from "./TitleFacetLayout.svelte";
  import TitleTabs from "./TitleTabs.svelte";

  type FacetTab = "reviews" | "watching" | "lists";

  const TAB_PARAM = "tab";
  const LIST_PAGE = 10;

  type TitleReviewsFacetProps = {
    slug: string;
    type: "movie" | "show";
    media: PosterMedia | undefined;
    href: string;
    credits: ReadonlyArray<{ key: string; name: string }>;
    stats: MediaStats | undefined;
    watching: Snippet;
    rail: Snippet;
  };

  const {
    slug,
    type,
    media,
    href,
    credits,
    stats,
    watching,
    rail,
  }: TitleReviewsFacetProps = $props();

  const tabIds: ReadonlyArray<FacetTab> = ["reviews", "watching", "lists"];
  const activeTab = $derived(
    parseTitleTab({ value: page.url.searchParams.get(TAB_PARAM), tabs: tabIds }),
  );

  const toCount = (value: number | undefined) =>
    value === undefined ? null : toHumanNumber(value, languageTag());

  const tabs = $derived([
    { id: "reviews" as const, label: m.list_title_comments(), count: toCount(stats?.comments) },
    { id: "watching" as const, label: m.boxed_title_tab_watching_now() },
    { id: "lists" as const, label: m.page_title_lists(), count: toCount(stats?.lists) },
  ]);
</script>

<TitleFacetLayout ambient={toAmbientColors(media?.colors)} {rail}>
  {#snippet header()}
    <TitleCompactHeader
      eyebrow={m.boxed_title_reviews_of()}
      title={media?.title}
      {href}
      poster={media?.poster.url.thumb}
      year={media?.year}
    >
      {#snippet credit()}
        {#each credits as person, index (person.key)}
          {#if index > 0},{/if}
          <a href={UrlBuilder.people(person.key)}>{person.name}</a>
        {/each}
      {/snippet}
    </TitleCompactHeader>
  {/snippet}

  {#snippet main()}
    <TitleTabs {tabs} active={activeTab} param={TAB_PARAM} variant="roomy" />

    {#if activeTab === "reviews"}
      <ReviewsTab
        {slug}
        target={{ type }}
        {toReviewHref}
      />
    {:else if activeTab === "watching"}
      {@render watching()}
    {:else}
      <div class="boxed-facet-lists">
        <ListsLoader
          {slug}
          title={media?.title ?? ""}
          {type}
          count={LIST_PAGE}
          paginate
        />
      </div>
    {/if}
  {/snippet}
</TitleFacetLayout>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .boxed-facet-lists {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: var(--ni-12);

    @include for-mobile {
      grid-template-columns: minmax(0, 1fr);
    }
  }
</style>
