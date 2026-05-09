<script lang="ts">
  /*
    Single row in the Letterboxd-style search feed: poster left,
    title/year/alt-titles/director chip stacked right. Three
    discriminated variants — media (movie/show), person, and list.
    Reference: ../../../../../../letterboxd-research/notes/search.md.
  */
  import * as m from "$lib/features/i18n/messages.ts";
  import Link from "$lib/components/link/Link.svelte";
  import CrossOriginImage from "$lib/features/image/components/CrossOriginImage.svelte";
  import type { MediaEntry } from "$lib/requests/models/MediaEntry";
  import type { MediaListSummary } from "$lib/requests/models/MediaListSummary";
  import type { PersonSummary } from "$lib/requests/models/PersonSummary";
  import { MEDIA_POSTER_PLACEHOLDER } from "$lib/utils/assets";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import type { SearchItem } from "../models/SearchItem";

  type LetterboxdSearchRowProps = {
    item: SearchItem;
  };

  const { item }: LetterboxdSearchRowProps = $props();

  const isMedia = (i: SearchItem): i is MediaEntry =>
    "type" in i && (i.type === "movie" || i.type === "show");
  const isPerson = (i: SearchItem): i is PersonSummary => "biography" in i;
  const isList = (i: SearchItem): i is MediaListSummary =>
    "posters" in i && "user" in i;

  const mediaHref = $derived.by(() => {
    if (!isMedia(item)) return "#";
    return item.type === "movie"
      ? UrlBuilder.movie(item.slug)
      : UrlBuilder.show(item.slug);
  });
</script>

<article class="lb-search-row">
  {#if isMedia(item)}
    <Link href={mediaHref} color="inherit">
      <div class="lb-search-row-poster">
        <CrossOriginImage
          classList="lb-search-row-poster-img"
          src={item.poster?.url?.thumb ?? MEDIA_POSTER_PLACEHOLDER}
          alt={item.title}
        />
      </div>
    </Link>

    <div class="lb-search-row-body">
      <h3 class="lb-search-row-title">
        <Link href={mediaHref} color="inherit">
          {item.title}
          {#if item.year}
            <span class="lb-search-row-year">{item.year}</span>
          {/if}
        </Link>
      </h3>

      {#if item.originalTitle && item.originalTitle !== item.title}
        <p class="lb-search-row-alt">
          <span class="lb-search-row-alt-label">
            {m.lb_search_alt_title()}
          </span>
          <span>{item.originalTitle}</span>
        </p>
      {/if}

      <p class="lb-search-row-meta">
        <span class="lb-search-row-entity">
          {item.type === "movie"
            ? m.eyebrow_entity_film()
            : m.eyebrow_entity_show()}
        </span>
        {#if item.country}
          <span class="lb-search-row-divider">·</span>
          <span>{item.country.toUpperCase()}</span>
        {/if}
        {#if item.runtime}
          <span class="lb-search-row-divider">·</span>
          <span>{item.runtime} {m.lb_meta_unit_minutes()}</span>
        {/if}
      </p>
    </div>
  {:else if isPerson(item)}
    <Link href={UrlBuilder.people(item.key)} color="inherit">
      <div class="lb-search-row-poster lb-search-row-poster-person">
        <CrossOriginImage
          classList="lb-search-row-poster-img"
          src={item.headshot?.url?.thumb ?? MEDIA_POSTER_PLACEHOLDER}
          alt={item.name}
        />
      </div>
    </Link>

    <div class="lb-search-row-body">
      <h3 class="lb-search-row-title">
        <Link href={UrlBuilder.people(item.key)} color="inherit">
          {item.name}
        </Link>
      </h3>

      <p class="lb-search-row-meta">
        <span class="lb-search-row-entity">
          {m.lb_search_entity_person()}
        </span>
        {#if item.knownFor}
          <span class="lb-search-row-divider">·</span>
          <span>{item.knownFor}</span>
        {/if}
      </p>

      {#if item.biography}
        <p class="lb-search-row-bio">
          {item.biography.slice(0, 220)}{item.biography.length > 220 ? "…" : ""}
        </p>
      {/if}
    </div>
  {:else if isList(item)}
    <Link
      href={UrlBuilder.users(item.user.key).lists(item.slug)}
      color="inherit"
    >
      <div class="lb-search-row-collage">
        {#each item.posters.slice(0, 4) as poster, i (i)}
          <CrossOriginImage
            classList="lb-search-row-collage-img"
            src={poster.url.thumb}
            alt=""
          />
        {/each}
      </div>
    </Link>

    <div class="lb-search-row-body">
      <h3 class="lb-search-row-title">
        <Link
          href={UrlBuilder.users(item.user.key).lists(item.slug)}
          color="inherit"
        >
          {item.name}
        </Link>
      </h3>

      <p class="lb-search-row-meta">
        <span class="lb-search-row-entity">{m.lb_search_entity_list()}</span>
        <span class="lb-search-row-divider">·</span>
        <span class="lb-search-row-byline">
          {m.lb_search_list_byline({ user: item.user.name?.full ?? "" })}
        </span>
        <span class="lb-search-row-divider">·</span>
        <span>{item.count} {m.lb_search_list_count_unit()}</span>
      </p>

      {#if item.description}
        <p class="lb-search-row-bio">
          {item.description.slice(0, 220)}{item.description.length > 220
            ? "…"
            : ""}
        </p>
      {/if}
    </div>
  {/if}
</article>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .lb-search-row {
    display: grid;
    grid-template-columns: var(--ni-72) 1fr;
    gap: var(--ni-16);
    padding: var(--ni-18) 0;
    border-bottom: 1px solid
      color-mix(in srgb, var(--color-foreground) 8%, transparent);
    align-items: start;

    @include for-tablet-lg {
      grid-template-columns: var(--ni-110) 1fr;
      gap: var(--ni-22);
    }
  }

  .lb-search-row-poster {
    width: 100%;
    aspect-ratio: 2 / 3;
    overflow: hidden;
    border-radius: var(--border-radius-xs);
  }

  .lb-search-row-poster-person {
    aspect-ratio: 1 / 1;
    border-radius: 999px;
  }

  :global(.lb-search-row-poster-img) {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .lb-search-row-collage {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 2px;
    width: 100%;
    aspect-ratio: 1 / 1;
    border-radius: var(--border-radius-xs);
    overflow: hidden;
  }

  :global(.lb-search-row-collage-img) {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .lb-search-row-body {
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: var(--ni-6);
  }

  .lb-search-row-title {
    margin: 0;
    font-size: var(--ni-18);
    font-weight: 700;
    color: var(--color-foreground);
    line-height: 1.2;

    @include for-tablet-lg {
      font-size: var(--ni-22);
    }
  }

  .lb-search-row-year {
    color: var(--color-text-secondary);
    font-weight: 500;
    margin-left: var(--ni-6);
  }

  .lb-search-row-alt {
    margin: 0;
    font-size: var(--ni-12);
    color: var(--color-text-secondary);
    line-height: 1.4;
  }

  .lb-search-row-alt-label {
    text-transform: uppercase;
    letter-spacing: 0.1em;
    font-weight: 700;
    margin-right: var(--ni-6);
    font-size: var(--ni-10);
  }

  .lb-search-row-meta {
    margin: 0;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--ni-6);
    font-size: var(--ni-12);
    color: var(--color-text-secondary);
  }

  .lb-search-row-entity {
    display: inline-block;
    padding: 2px var(--ni-8);
    background: color-mix(in srgb, var(--tboxed-positive) 20%, transparent);
    color: var(--tboxed-positive);
    border-radius: var(--border-radius-xs);
    text-transform: uppercase;
    letter-spacing: 0.1em;
    font-size: var(--ni-10);
    font-weight: 700;
  }

  .lb-search-row-divider {
    color: color-mix(in srgb, var(--color-foreground) 30%, transparent);
  }

  .lb-search-row-byline {
    color: var(--color-foreground);
    font-weight: 500;
  }

  .lb-search-row-bio {
    margin: 0;
    color: color-mix(in srgb, var(--color-foreground) 80%, transparent);
    font-size: var(--ni-13);
    line-height: 1.55;
  }
</style>
