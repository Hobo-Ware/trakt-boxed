<script lang="ts">
  import type { MovieEntry } from '$lib/requests/models/MovieEntry.ts';
  import type { UpcomingEpisodeEntry } from '$lib/requests/queries/calendars/upcomingEpisodesQuery.ts';
  import { UrlBuilder } from '$lib/utils/url/UrlBuilder.ts';

  type Props = { item: UpcomingEpisodeEntry | MovieEntry };
  const { item }: Props = $props();

  const timeFormatter = new Intl.DateTimeFormat(undefined, {
    hour: 'numeric',
    minute: '2-digit',
  });

  const isEpisode = $derived('show' in item);
  const poster = $derived(
    isEpisode
      ? (item as UpcomingEpisodeEntry).show.poster?.url?.thumb
      : (item as MovieEntry).poster?.url?.thumb,
  );
  const title = $derived(
    isEpisode
      ? (item as UpcomingEpisodeEntry).show.title
      : (item as MovieEntry).title,
  );
  const subtitle = $derived(
    isEpisode ? (item as UpcomingEpisodeEntry).title : null,
  );
  const badge = $derived.by(() => {
    if (!isEpisode) return null;
    const ep = item as UpcomingEpisodeEntry;
    return `S${String(ep.season).padStart(2, '0')} · E${String(ep.number).padStart(2, '0')}`;
  });
  const href = $derived(
    isEpisode
      ? UrlBuilder.show((item as UpcomingEpisodeEntry).show.slug, {
          season: (item as UpcomingEpisodeEntry).season,
        })
      : UrlBuilder.movie((item as MovieEntry).slug),
  );
</script>

<a class="calendar-card" {href} aria-label={title}>
  <div class="calendar-card__poster">
    {#if poster}
      <img src={poster} alt={title} loading="lazy" />
    {:else}
      <span aria-hidden="true">{title.charAt(0)}</span>
    {/if}
  </div>
  <div class="calendar-card__body">
    {#if badge}
      <span class="calendar-card__badge">{badge}</span>
    {/if}
    <span class="calendar-card__title">{subtitle ?? title}</span>
    {#if subtitle}
      <span class="calendar-card__show">{title}</span>
    {/if}
    <time class="calendar-card__time">{timeFormatter.format(item.effectiveReleaseDate)}</time>
  </div>
</a>

<style lang="scss">
  .calendar-card {
    display: grid;
    grid-template-columns: 56px 1fr;
    gap: var(--gap-s);
    padding: var(--gap-xs);
    border-radius: 3px;
    background: color-mix(in srgb, var(--shade-900) 70%, transparent);
    border: 1px solid color-mix(in srgb, var(--shade-10) 5%, transparent);
    text-decoration: none;
    color: inherit;

    &:hover { border-color: var(--color-watched); }

    &__poster {
      width: 56px;
      aspect-ratio: 2 / 3;
      border-radius: 2px;
      overflow: hidden;
      background: color-mix(in srgb, var(--shade-900) 60%, transparent);
      display: flex;
      align-items: center;
      justify-content: center;

      img { width: 100%; height: 100%; object-fit: cover; }

      span {
        font-family: var(--font-family-serif, Georgia, serif);
        font-size: 1.1rem;
        color: var(--color-text-secondary);
      }
    }

    &__body {
      display: flex;
      flex-direction: column;
      gap: 2px;
      min-width: 0;
    }

    &__badge {
      font-size: 0.6rem;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: var(--color-watched);
      font-weight: 700;
    }

    &__title {
      font-size: 0.9rem;
      color: var(--color-text-primary);
      line-height: 1.2;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    &__show {
      font-size: 0.72rem;
      color: var(--color-text-secondary);
    }

    &__time {
      margin-top: 2px;
      font-size: 0.7rem;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      color: var(--color-text-secondary);
    }
  }
</style>
