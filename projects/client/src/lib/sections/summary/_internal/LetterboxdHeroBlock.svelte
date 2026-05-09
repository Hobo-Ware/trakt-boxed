<script lang="ts">
  /*
    Hero text block — eyebrow + Fraunces title + year/credit
    attribution line. Sits inside the LetterboxdSummaryShell main
    column so the desktop two-col grid lines up; no backdrop /
    poster of its own, those belong to the shell.
  */
  import * as m from "$lib/features/i18n/messages.ts";
  import Link from "$lib/components/link/Link.svelte";
  import type { CrewMember, MediaCrew } from "$lib/requests/models/MediaCrew";
  import type { MediaType } from "$lib/requests/models/MediaType";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";

  type LetterboxdHeroBlockProps = {
    title: string;
    year?: number | null;
    type: MediaType;
    crew: MediaCrew;
  };

  const { title, year, type, crew }: LetterboxdHeroBlockProps = $props();

  const credit = $derived.by((): { label: string; people: CrewMember[] } => {
    if (type === "show") {
      const creators = crew.creators ?? [];
      if (creators.length > 0)
        return { label: m.eyebrow_credit_created_by(), people: creators };
    }
    const directors = crew.directors ?? [];
    if (directors.length > 0)
      return { label: m.eyebrow_credit_directed_by(), people: directors };
    const writers = crew.writers ?? [];
    if (writers.length > 0)
      return { label: m.eyebrow_credit_written_by(), people: writers };
    return { label: "", people: [] };
  });

  const eyebrow = $derived(
    type === "movie" ? m.eyebrow_entity_film() : m.eyebrow_entity_show(),
  );
</script>

<header class="lb-hero-block">
  <p class="lb-hero-block-eyebrow">{eyebrow}</p>
  <h1 class="lb-hero-block-title">{title}</h1>
  <p class="lb-hero-block-attr">
    {#if year}
      <span class="lb-hero-block-year">{year}</span>
    {/if}
    {#if credit.people.length > 0}
      <span class="lb-hero-block-credit-label">{credit.label}</span>
      {#each credit.people as person, i (person.key)}
        {#if i > 0},{/if}
        <Link href={UrlBuilder.people(person.key)} color="inherit">
          <span class="lb-hero-block-credit-name">{person.name}</span>
        </Link>
      {/each}
    {/if}
  </p>
</header>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .lb-hero-block {
    display: flex;
    flex-direction: column;
    gap: var(--ni-12);
    padding-bottom: var(--ni-18);
  }

  .lb-hero-block-eyebrow {
    margin: 0;
    font-size: var(--ni-11);
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--color-text-secondary);
    font-weight: 700;
  }

  .lb-hero-block-title {
    margin: 0;
    font-family: "Fraunces", "Iowan Old Style", "Palatino", Georgia, serif;
    font-optical-sizing: auto;
    font-weight: 700;
    letter-spacing: -0.02em;
    line-height: 1;
    color: var(--color-foreground);
    font-size: var(--ni-32);

    @include for-tablet-sm {
      font-size: var(--ni-44);
    }

    @include for-tablet-lg {
      font-size: var(--ni-60);
    }
  }

  .lb-hero-block-attr {
    margin: 0;
    color: var(--color-text-secondary);
    font-size: var(--ni-13);
    line-height: 1.4;
    display: inline-flex;
    flex-wrap: wrap;
    gap: var(--ni-6);
    align-items: baseline;
  }

  .lb-hero-block-year {
    color: var(--color-foreground);
    font-weight: 600;
  }

  .lb-hero-block-credit-label {
    text-transform: uppercase;
    letter-spacing: 0.1em;
    font-size: var(--ni-11);
  }

  .lb-hero-block-credit-name {
    color: var(--tboxed-positive);
    font-weight: 700;
    font-size: var(--ni-13);
  }
</style>
