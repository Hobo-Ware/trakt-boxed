<script lang="ts">
  /*
    The Journal route.

    Letterboxd's /journal/ is an editorial publication. trakt-boxed
    has no editorial CMS, so this page reframes the same affordance
    in a way Trakt's data can fill: a curated feed of popular films
    and shows treated editorially — cinematic backdrop card +
    serif title + synopsis dek + drilldown to the entity. Layout,
    typography, and rhythm match Letterboxd's Journal
    (research/notes/journal.md).
  */
  import Link from "$lib/components/link/Link.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import CrossOriginImage from "$lib/features/image/components/CrossOriginImage.svelte";
  import TraktPage from "$lib/sections/layout/TraktPage.svelte";
  import { usePopularList } from "$lib/sections/lists/popular/usePopularList";
  import NavbarStateSetter from "$lib/sections/navbar/NavbarStateSetter.svelte";
  import { DEFAULT_SHARE_COVER } from "$lib/utils/assets";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";

  const { list: movies } = $derived(usePopularList({ type: "movie" }));
  const { list: shows } = $derived(usePopularList({ type: "show" }));

  const stories = $derived.by(() => {
    type Story = {
      id: string;
      title: string;
      synopsis: string | undefined;
      backdrop: string | undefined;
      year: number | undefined;
      href: string;
      kind: "film" | "show";
    };
    const all: Story[] = [];
    for (const entry of $movies ?? []) {
      const media = (entry as { media?: typeof entry }).media ?? entry;
      if (!media || !("slug" in media)) continue;
      all.push({
        id: `m-${media.id}`,
        title: media.title,
        synopsis: media.overview,
        backdrop: media.cover?.url?.medium,
        year: media.year,
        href: UrlBuilder.movie(media.slug),
        kind: "film",
      });
    }
    for (const entry of $shows ?? []) {
      const media = (entry as { media?: typeof entry }).media ?? entry;
      if (!media || !("slug" in media)) continue;
      all.push({
        id: `s-${media.id}`,
        title: media.title,
        synopsis: media.overview,
        backdrop: media.cover?.url?.medium,
        year: media.year,
        href: UrlBuilder.show(media.slug),
        kind: "show",
      });
    }
    return all;
  });

  const lead = $derived(stories[0]);
  const rest = $derived(stories.slice(1, 9));
</script>

<TraktPage
  audience="all"
  image={DEFAULT_SHARE_COVER}
  title={m.text_journal()}
>
  <NavbarStateSetter
    header={{ title: m.page_title_journal() }}
  />

  <div class="lb-journal">
    <header class="lb-journal-header">
      <p class="lb-journal-eyebrow">{m.eyebrow_journal()}</p>
    </header>

    {#if lead}
      <article class="lb-journal-lead">
        <Link href={lead.href} color="inherit">
          <div class="lb-journal-lead-grid">
            {#if lead.backdrop}
              <CrossOriginImage
                classList="lb-journal-lead-image"
                src={lead.backdrop}
                alt={lead.title}
              />
            {/if}
            <div class="lb-journal-lead-text">
              <p class="lb-journal-section">
                {lead.kind === "film"
                  ? m.eyebrow_journal_section_film()
                  : m.eyebrow_journal_section_show()}
              </p>
              <h2 class="lb-journal-lead-title">{lead.title}</h2>
              {#if lead.synopsis}
                <p class="lb-journal-lead-dek">{lead.synopsis}</p>
              {/if}
              {#if lead.year}
                <p class="lb-journal-byline">
                  <span>{lead.year}</span>
                </p>
              {/if}
            </div>
          </div>
        </Link>
      </article>
    {/if}

    {#if rest.length > 0}
      <section class="lb-journal-grid">
        {#each rest as story (story.id)}
          <article class="lb-journal-card">
            <Link href={story.href} color="inherit">
              {#if story.backdrop}
                <CrossOriginImage
                  classList="lb-journal-card-image"
                  src={story.backdrop}
                  alt={story.title}
                />
              {/if}
              <div class="lb-journal-card-body">
                <p class="lb-journal-section">
                  {story.kind === "film"
                    ? m.eyebrow_journal_section_film()
                    : m.eyebrow_journal_section_show()}
                </p>
                <h3 class="lb-journal-card-title">{story.title}</h3>
                {#if story.synopsis}
                  <p class="lb-journal-card-dek">{story.synopsis}</p>
                {/if}
                {#if story.year}
                  <p class="lb-journal-byline">
                    <span>{story.year}</span>
                  </p>
                {/if}
              </div>
            </Link>
          </article>
        {/each}
      </section>
    {/if}
  </div>
</TraktPage>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .lb-journal {
    background: color-mix(in srgb, var(--shade-700) 35%, var(--shade-900));
    width: 100%;
    margin-top: var(--ni-neg-44);
    padding-top: var(--ni-44);
    min-height: 80dvh;
  }

  .lb-journal-header {
    padding: var(--ni-26) var(--ni-16) var(--ni-12);
    max-width: var(--ni-1280);
    margin-inline: auto;
  }

  .lb-journal-eyebrow {
    margin: 0;
    font-size: var(--ni-11);
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--color-text-secondary);
    font-weight: 700;
  }

  .lb-journal-lead {
    padding: var(--ni-12) var(--ni-16) var(--ni-32);
    max-width: var(--ni-1280);
    margin-inline: auto;

    :global(.trakt-link) {
      text-decoration: none;
      display: block;
    }
  }

  .lb-journal-lead-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: var(--ni-22);

    @include for-tablet-lg {
      grid-template-columns: 1.1fr 1fr;
      align-items: center;
    }
  }

  :global(.lb-journal-lead-image) {
    width: 100%;
    aspect-ratio: 16 / 9;
    object-fit: cover;
    border-radius: var(--border-radius-s);
  }

  .lb-journal-lead-title {
    margin: var(--ni-12) 0 var(--ni-8);
    font-family: "Fraunces", "Iowan Old Style", "Palatino", Georgia, serif;
    font-weight: 700;
    font-size: var(--ni-26);
    letter-spacing: -0.01em;
    line-height: 1.1;
    color: var(--color-foreground);

    @include for-tablet-lg {
      font-size: var(--ni-36);
    }
  }

  .lb-journal-lead-dek {
    margin: 0 0 var(--ni-12);
    color: color-mix(in srgb, var(--color-foreground) 80%, transparent);
    font-size: var(--ni-15);
    line-height: 1.55;
    display: -webkit-box;
    -webkit-line-clamp: 4;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .lb-journal-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: var(--ni-22);
    padding: var(--ni-22) var(--ni-16) var(--ni-44);
    max-width: var(--ni-1280);
    margin-inline: auto;

    @include for-tablet-sm {
      grid-template-columns: repeat(2, 1fr);
    }

    @include for-tablet-lg {
      grid-template-columns: repeat(3, 1fr);
    }
  }

  .lb-journal-card {
    :global(.trakt-link) {
      text-decoration: none;
      display: block;
    }
  }

  :global(.lb-journal-card-image) {
    width: 100%;
    aspect-ratio: 16 / 10;
    object-fit: cover;
    border-radius: var(--border-radius-s);
    margin-bottom: var(--ni-12);
  }

  .lb-journal-card-body {
    display: flex;
    flex-direction: column;
    gap: var(--ni-6);
  }

  .lb-journal-section {
    margin: 0;
    font-size: var(--ni-10);
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--color-text-secondary);
    font-weight: 700;
  }

  .lb-journal-card-title {
    margin: 0;
    font-family: "Fraunces", "Iowan Old Style", "Palatino", Georgia, serif;
    font-weight: 700;
    font-size: var(--ni-22);
    line-height: 1.15;
    color: var(--color-foreground);
  }

  .lb-journal-card-dek {
    margin: 0;
    color: color-mix(in srgb, var(--color-foreground) 75%, transparent);
    font-size: var(--ni-13);
    line-height: 1.45;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .lb-journal-byline {
    margin: var(--ni-4) 0 0;
    font-size: var(--ni-11);
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--color-text-secondary);

    span {
      color: var(--tboxed-positive);
      font-weight: 700;
    }
  }
</style>
