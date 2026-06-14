<script lang="ts">
  import * as m from '$lib/features/i18n/messages.ts';
  import type { Season } from '$lib/requests/models/Season.ts';
  import FilmSeasonRow from './FilmSeasonRow.svelte';

  type Props = {
    slug: string;
    seasons: ReadonlyArray<Season>;
  };

  const { slug, seasons }: Props = $props();

  const sorted = $derived([...seasons].sort((a, b) => a.number - b.number));
</script>

<div class="film-seasons">
  {#if sorted.length === 0}
    <p class="film-seasons__empty">{m.seasons_empty()}</p>
  {:else}
    {#each sorted as season (season.id)}
      <FilmSeasonRow {slug} {season} />
    {/each}
  {/if}
</div>

<style lang="scss">
  .film-seasons {
    padding-top: var(--gap-m);

    &__empty {
      margin: 0;
      padding: var(--gap-l) 0;
      text-align: center;
      color: var(--color-text-secondary);
    }
  }
</style>
