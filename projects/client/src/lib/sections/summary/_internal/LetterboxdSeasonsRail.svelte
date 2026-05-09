<script lang="ts">
  /*
    Show seasons strip — flat poster row with season number,
    episode count, and air span. Each cell routes to
    /shows/[slug]?season=N where the rest of the show page
    surfaces the season episodes.
  */
  import * as m from "$lib/features/i18n/messages.ts";
  import Link from "$lib/components/link/Link.svelte";
  import CrossOriginImage from "$lib/features/image/components/CrossOriginImage.svelte";
  import type { Season } from "$lib/requests/models/Season";
  import type { ShowEntry } from "$lib/requests/models/ShowEntry";
  import { MEDIA_POSTER_PLACEHOLDER } from "$lib/utils/assets";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";

  type LetterboxdSeasonsRailProps = {
    show: ShowEntry;
    seasons: Season[];
    currentSeason?: number;
  };

  const { show, seasons, currentSeason }: LetterboxdSeasonsRailProps =
    $props();

  const visibleSeasons = $derived(
    seasons
      .filter((s) => s.number > 0)
      .sort((a, b) => a.number - b.number),
  );

  const formatYear = (date?: Date | null) => {
    if (!date) return "";
    try {
      return new Intl.DateTimeFormat(undefined, { year: "numeric" }).format(
        date,
      );
    } catch {
      return "";
    }
  };
</script>

{#if visibleSeasons.length > 0}
  <section class="lb-seasons">
    <header class="lb-seasons-head">
      <h3>{m.lb_section_seasons()}</h3>
      <span class="lb-seasons-count">
        {visibleSeasons.length}
        {m.lb_seasons_count_unit()}
      </span>
    </header>

    <ul class="lb-seasons-grid">
      {#each visibleSeasons as season (season.number)}
        <li
          class="lb-seasons-cell"
          class:active={season.number === currentSeason}
        >
          <Link
            href={UrlBuilder.show(show.slug, { season: season.number })}
            color="inherit"
          >
            <div class="lb-seasons-poster">
              <CrossOriginImage
                classList="lb-seasons-poster-img"
                src={season.poster?.url?.thumb ?? MEDIA_POSTER_PLACEHOLDER}
                alt={m.lb_episode_season_number({ number: season.number })}
              />
            </div>
            <p class="lb-seasons-label">
              {m.lb_episode_season_number({ number: season.number })}
            </p>
            <p class="lb-seasons-meta">
              {season.episodes.count}
              {m.lb_seasons_episodes_unit()}
              {#if season.airDate}
                <span class="lb-seasons-divider" aria-hidden="true">·</span>
                <span>{formatYear(season.airDate)}</span>
              {/if}
            </p>
          </Link>
        </li>
      {/each}
    </ul>
  </section>
{/if}

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .lb-seasons {
    padding: var(--ni-22) 0;
    border-top: 1px solid
      color-mix(in srgb, var(--color-foreground) 8%, transparent);
  }

  .lb-seasons-head {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    margin-bottom: var(--ni-12);

    h3 {
      margin: 0;
      font-size: var(--ni-11);
      letter-spacing: 0.16em;
      text-transform: uppercase;
      font-weight: 700;
      color: var(--color-text-secondary);
    }
  }

  .lb-seasons-count {
    font-size: var(--ni-11);
    color: var(--color-text-secondary);
    text-transform: uppercase;
    letter-spacing: 0.12em;
  }

  .lb-seasons-grid {
    margin: 0;
    padding: 0;
    list-style: none;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: var(--ni-12);

    @include for-tablet-sm {
      grid-template-columns: repeat(4, 1fr);
    }

    @include for-tablet-lg {
      grid-template-columns: repeat(6, 1fr);
    }
  }

  .lb-seasons-cell {
    min-width: 0;
  }

  .lb-seasons-poster {
    width: 100%;
    aspect-ratio: 2 / 3;
    overflow: hidden;
    border-radius: var(--border-radius-xs);
    border: 1px solid transparent;
  }

  .lb-seasons-cell.active .lb-seasons-poster {
    border-color: var(--tboxed-positive);
  }

  :global(.lb-seasons-poster-img) {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .lb-seasons-label {
    margin: var(--ni-6) 0 var(--ni-2) 0;
    font-size: var(--ni-12);
    text-transform: uppercase;
    letter-spacing: 0.12em;
    font-weight: 700;
    color: var(--color-foreground);
  }

  .lb-seasons-cell.active .lb-seasons-label {
    color: var(--tboxed-positive);
  }

  .lb-seasons-meta {
    margin: 0;
    font-size: var(--ni-11);
    color: var(--color-text-secondary);
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--ni-4);
  }

  .lb-seasons-divider {
    color: color-mix(in srgb, var(--color-foreground) 25%, transparent);
  }
</style>
