<script lang="ts">
  import * as m from '$lib/features/i18n/messages.ts';
  import { useQuery } from '$lib/features/query/useQuery.ts';
  import type { Season } from '$lib/requests/models/Season.ts';
  import { showSeasonEpisodesQuery } from '$lib/requests/queries/shows/showSeasonEpisodesQuery.ts';
  import { UrlBuilder } from '$lib/utils/url/UrlBuilder.ts';
  import { map } from 'rxjs';

  type Props = { slug: string; season: Season };
  const { slug, season }: Props = $props();

  const query = useQuery(showSeasonEpisodesQuery({ slug, season: season.number }));
  const episodes = $derived(query.pipe(map(($q) => $q.data ?? [])));
  const isLoading = $derived(
    query.pipe(map(($q) => $q.isLoading || ($q.isFetching && !$q.data))),
  );

  const dateFormatter = new Intl.DateTimeFormat(undefined, {
    year: 'numeric',
    month: 'short',
  });

  const seasonLabel = $derived(
    season.number === 0
      ? m.season_picker_specials()
      : m.season_picker_season({ n: String(season.number) }),
  );
</script>

<section class="season-row">
  <header class="season-row__head">
    <div class="season-row__poster">
      {#if season.poster?.url?.thumb}
        <img src={season.poster.url.thumb} alt={seasonLabel} loading="lazy" />
      {:else}
        <span aria-hidden="true">{season.number}</span>
      {/if}
    </div>
    <div class="season-row__meta">
      <p class="season-row__eyebrow">{m.seasons_eyebrow()}</p>
      <h3 class="season-row__title">{seasonLabel}</h3>
      <p class="season-row__sub">
        <span>{season.episodes.count} {m.seasons_episodes()}</span>
        {#if season.airDate}<span>·</span><span>{dateFormatter.format(season.airDate)}</span>{/if}
        {#if season.network}<span>·</span><span>{season.network}</span>{/if}
      </p>
    </div>
  </header>

  <div class="season-row__strip">
    {#if $isLoading && $episodes.length === 0}
      {#each Array.from({ length: 6 }) as _, i (i)}
        <div class="season-row__skeleton-card"></div>
      {/each}
    {:else}
      {#each $episodes as episode (episode.id)}
        <a
          class="season-row__episode"
          href={UrlBuilder.show(slug, { season: season.number })}
        >
          <div class="season-row__still">
            {#if episode.cover?.url}
              <img src={episode.cover.url} alt={episode.title} loading="lazy" />
            {:else}
              <span aria-hidden="true">{episode.number}</span>
            {/if}
            <span class="season-row__episode-number">E{episode.number}</span>
          </div>
          <span class="season-row__episode-title">{episode.title}</span>
          {#if episode.airDate}
            <time class="season-row__episode-air">{dateFormatter.format(episode.airDate)}</time>
          {/if}
        </a>
      {/each}
    {/if}
  </div>
</section>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .season-row {
    padding: var(--gap-l) 0;
    border-bottom: 1px solid color-mix(in srgb, var(--shade-10) 6%, transparent);

    &:last-child { border-bottom: none; }

    &__head {
      display: grid;
      grid-template-columns: 96px 1fr;
      gap: var(--gap-m);
      align-items: center;
      margin-bottom: var(--gap-m);

      @include for-mobile {
        grid-template-columns: 64px 1fr;
      }
    }

    &__poster {
      width: 100%;
      aspect-ratio: 2 / 3;
      border-radius: 3px;
      overflow: hidden;
      background: color-mix(in srgb, var(--shade-900) 70%, transparent);
      display: flex;
      align-items: center;
      justify-content: center;

      img { width: 100%; height: 100%; object-fit: cover; }

      span {
        font-family: var(--font-family-serif, Georgia, serif);
        font-size: 1.6rem;
        color: var(--color-text-secondary);
      }
    }

    &__meta {
      display: flex;
      flex-direction: column;
      gap: 4px;
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
      font-size: clamp(1.3rem, 2.2vw, 1.7rem);
      line-height: 1.1;
      color: var(--color-text-primary);
    }

    &__sub {
      margin: 0;
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      font-size: 0.78rem;
      color: var(--color-text-secondary);
    }

    &__strip {
      display: grid;
      grid-auto-flow: column;
      grid-auto-columns: 180px;
      gap: var(--gap-s);
      overflow-x: auto;
      padding-bottom: var(--gap-xs);
      scroll-snap-type: x mandatory;
      scrollbar-width: thin;

      &::-webkit-scrollbar { height: 6px; }
      &::-webkit-scrollbar-thumb {
        background: color-mix(in srgb, var(--shade-10) 12%, transparent);
        border-radius: 3px;
      }

      @include for-mobile {
        grid-auto-columns: 140px;
      }
    }

    &__episode {
      display: flex;
      flex-direction: column;
      gap: 6px;
      text-decoration: none;
      color: inherit;
      scroll-snap-align: start;
    }

    &__still {
      position: relative;
      width: 100%;
      aspect-ratio: 16 / 9;
      border-radius: 3px;
      overflow: hidden;
      background: var(--shade-900);
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow:
        0 0 0 1px color-mix(in srgb, var(--shade-10) 6%, transparent) inset,
        0 6px 14px -8px rgba(0, 0, 0, 0.55);

      img { width: 100%; height: 100%; object-fit: cover; }

      span {
        font-family: var(--font-family-serif, Georgia, serif);
        font-size: 1.2rem;
        color: var(--color-text-secondary);
      }
    }

    &__episode-number {
      position: absolute;
      top: 6px;
      left: 6px;
      padding: 2px 6px;
      border-radius: 2px;
      font-size: 0.65rem;
      letter-spacing: 0.08em;
      font-weight: 700;
      color: var(--shade-1000);
      background: color-mix(in srgb, var(--color-watched) 90%, transparent);
    }

    &__episode-title {
      font-size: 0.85rem;
      line-height: 1.25;
      color: var(--color-text-primary);
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    &__episode-air {
      font-size: 0.7rem;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      color: var(--color-text-secondary);
    }

    &__skeleton-card {
      width: 100%;
      aspect-ratio: 16 / 9;
      border-radius: 3px;
      background: var(--shade-900);
    }
  }
</style>
