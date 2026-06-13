<script lang="ts">
  import PosterGrid from '$lib/sections/film/PosterGrid.svelte';
  import type { MovieEntry } from '$lib/requests/models/MovieEntry.ts';
  import type { ShowEntry } from '$lib/requests/models/ShowEntry.ts';

  type Props = {
    eyebrow?: string;
    title: string;
    viewAllHref?: string;
    viewAllLabel?: string;
    entries: ReadonlyArray<MovieEntry | ShowEntry>;
  };

  const { eyebrow, title, viewAllHref, viewAllLabel, entries }: Props = $props();
</script>

<section class="home-row">
  <header class="home-row__header">
    <div class="home-row__heading">
      {#if eyebrow}
        <p class="home-row__eyebrow">{eyebrow}</p>
      {/if}
      <h2 class="home-row__title">{title}</h2>
    </div>
    {#if viewAllHref && viewAllLabel}
      <a class="home-row__view-all" href={viewAllHref}>{viewAllLabel}</a>
    {/if}
  </header>

  {#if entries.length > 0}
    <PosterGrid entries={entries.slice(0, 7)} columns={7} />
  {/if}
</section>

<style lang="scss">
  .home-row {
    padding-top: var(--gap-l);

    &__header {
      display: flex;
      align-items: flex-end;
      justify-content: space-between;
      gap: var(--gap-m);
      padding-bottom: var(--gap-s);
      border-bottom: 1px solid color-mix(in srgb, var(--shade-10) 8%, transparent);
      margin-bottom: var(--gap-m);
    }

    &__heading {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    &__eyebrow {
      margin: 0;
      font-size: 0.7rem;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: var(--color-text-secondary);
      font-weight: 700;
    }

    &__title {
      margin: 0;
      font-family: var(--font-family-serif, "Tiempos Headline", Georgia, serif);
      font-weight: 400;
      font-size: clamp(1.2rem, 2.4vw, 1.8rem);
      color: var(--color-text-primary);
    }

    &__view-all {
      font-size: 0.72rem;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: var(--color-text-secondary);
      text-decoration: none;
      font-weight: 700;

      &:hover {
        color: var(--color-background-green, var(--green-500));
      }
    }
  }
</style>
