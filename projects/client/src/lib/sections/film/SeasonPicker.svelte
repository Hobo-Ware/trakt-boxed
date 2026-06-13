<script lang="ts">
  import type { Season } from '$lib/requests/models/Season.ts';
  import * as m from '$lib/features/i18n/messages.ts';
  import { UrlBuilder } from '$lib/utils/url/UrlBuilder.ts';

  type Props = {
    slug: string;
    seasons: ReadonlyArray<Season>;
    activeSeason: number;
  };

  const { slug, seasons, activeSeason }: Props = $props();

  const sortedSeasons = $derived(
    [...seasons].sort((a, b) => a.number - b.number),
  );
</script>

<nav class="season-picker" aria-label={m.season_picker_label()}>
  <p class="season-picker__label">{m.season_picker_label()}</p>
  <ul class="season-picker__list">
    {#each sortedSeasons as season (season.id)}
      <li>
        <a
          class="season-picker__pill"
          data-active={season.number === activeSeason ? 'true' : undefined}
          href={UrlBuilder.show(slug, { season: season.number })}
        >
          {#if season.number === 0}
            {m.season_picker_specials()}
          {:else}
            {m.season_picker_season({ n: String(season.number) })}
          {/if}
        </a>
      </li>
    {/each}
  </ul>
</nav>

<style lang="scss">
  .season-picker {
    padding-top: var(--gap-l);
    display: flex;
    flex-direction: column;
    gap: var(--gap-xs);

    &__label {
      margin: 0;
      font-size: 0.7rem;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: var(--color-text-secondary);
      font-weight: 700;
    }

    &__list {
      list-style: none;
      margin: 0;
      padding: 0;
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
    }

    &__pill {
      display: inline-flex;
      align-items: center;
      padding: 0.3rem 0.75rem;
      border-radius: 2px;
      font-size: 0.78rem;
      letter-spacing: 0.04em;
      text-decoration: none;
      color: var(--color-text-secondary);
      background: color-mix(in srgb, var(--shade-900) 70%, transparent);
      border: 1px solid color-mix(in srgb, var(--shade-10) 6%, transparent);

      &:hover {
        color: var(--color-text-primary);
        border-color: color-mix(in srgb, var(--shade-10) 14%, transparent);
      }

      &[data-active='true'] {
        background: var(--color-background-green, var(--green-500));
        color: var(--shade-1000);
        border-color: var(--color-background-green, var(--green-500));
        font-weight: 700;
      }
    }
  }
</style>
