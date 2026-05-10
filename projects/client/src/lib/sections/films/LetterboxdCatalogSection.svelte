<script lang="ts" generics="T extends { id: number; type: 'movie' | 'show'; slug: string; title: string; poster: { url: { thumb?: string | undefined } } }">
  /*
    A single titled section in the Letterboxd-style films / shows
    catalog: tracked uppercase eyebrow + Fraunces "All" link, then a
    flush poster grid. Owns its own data via the query passed in.
    No SectionList wrapper.
  */
  import * as m from "$lib/features/i18n/messages.ts";
  import Link from "$lib/components/link/Link.svelte";
  import MediaPoster from "$lib/components/media/MediaPoster.svelte";
  import { usePaginatedListQuery } from "$lib/sections/lists/stores/usePaginatedListQuery.ts";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import { map } from "rxjs";

  type LetterboxdCatalogSectionProps = {
    label: string;
    drilldownHref: string;
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    query: any;
    limit?: number;
  };

  const {
    label,
    drilldownHref,
    query,
    limit = 12,
  }: LetterboxdCatalogSectionProps = $props();

  const { list } = usePaginatedListQuery(query);
  const items = list.pipe(map((entries) => (entries as T[]).slice(0, limit)));
</script>

{#if $items.length > 0}
  <section class="lb-cat-section">
    <header class="lb-cat-section-head">
      <h2>{label}</h2>
      <Link href={drilldownHref} color="inherit">
        <span class="lb-cat-section-all">{m.lb_section_view_all()}</span>
      </Link>
    </header>
    <div class="lb-cat-section-grid">
      {#each $items as item (item.id)}
        <MediaPoster
          src={item.poster.url.thumb ?? ""}
          alt={item.title}
          href={UrlBuilder.media(item.type, item.slug)}
          media={{ id: item.id, type: item.type }}
        />
      {/each}
    </div>
  </section>
{/if}

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .lb-cat-section {
    padding: var(--ni-26) 0;
    border-top: 1px solid
      color-mix(in srgb, var(--color-foreground) 8%, transparent);
  }

  .lb-cat-section-head {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    margin-bottom: var(--ni-14);

    h2 {
      margin: 0;
      font-size: var(--ni-12);
      letter-spacing: 0.16em;
      text-transform: uppercase;
      font-weight: 700;
      color: var(--color-foreground);
    }
  }

  .lb-cat-section-all {
    font-size: var(--ni-11);
    letter-spacing: 0.16em;
    text-transform: uppercase;
    font-weight: 700;
    color: var(--color-text-secondary);

    &:hover {
      color: var(--tboxed-positive);
    }
  }

  .lb-cat-section-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: var(--ni-12);

    @include for-tablet-sm {
      grid-template-columns: repeat(6, 1fr);
    }

    @include for-tablet-lg {
      grid-template-columns: repeat(8, 1fr);
    }
  }
</style>
