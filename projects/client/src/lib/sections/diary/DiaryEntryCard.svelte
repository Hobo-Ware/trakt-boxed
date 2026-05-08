<script lang="ts">
  /*
    A single diary row, mobile-first card variant. Layout:

      [calendar tile]  [poster]  title
                                 verb-eyebrow + rating + heart

    Episodes carry the show title as the headline and the episode
    title as the subtitle — episodes are first-class in trakt-boxed,
    not folded into the show entry like Letterboxd does.
  */
  import FavoriteIcon from "$lib/components/icons/FavoriteIcon.svelte";
  import Link from "$lib/components/link/Link.svelte";
  import MediaRating from "$lib/components/media/MediaRating.svelte";
  import { useUser } from "$lib/features/auth/stores/useUser";
  import { MEDIA_POSTER_PLACEHOLDER } from "$lib/utils/assets";
  import { episodeNumberLabel } from "$lib/utils/intl/episodeNumberLabel";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import type { HistoryEntry } from "../lists/stores/models/HistoryEntry";
  import CalendarTile from "./CalendarTile.svelte";

  type DiaryEntryCardProps = {
    entry: HistoryEntry;
  };

  const { entry }: DiaryEntryCardProps = $props();

  const watchedAt = $derived(new Date(entry.watchedAt));

  const { favorites, ratings } = useUser();

  const view = $derived.by(() => {
    if (entry.type === "episode") {
      const { episode, show } = entry;
      const rating = $ratings?.episodes.get(episode.id)?.rating;
      return {
        href: UrlBuilder.episode(show.slug, episode.season, episode.number),
        poster: show.poster.url.thumb ?? MEDIA_POSTER_PLACEHOLDER,
        title: show.title,
        subtitle: `${episodeNumberLabel({
          seasonNumber: episode.season,
          episodeNumber: episode.number,
        })} · ${episode.title}`,
        eyebrow: "watched",
        rating,
        liked: false,
      };
    }

    const { movie } = entry;
    const rating = $ratings?.movies.get(movie.id)?.rating;
    const liked = $favorites?.movies.has(movie.id) ?? false;
    return {
      href: UrlBuilder.movie(movie.slug),
      poster: movie.poster.url.thumb ?? MEDIA_POSTER_PLACEHOLDER,
      title: movie.title,
      subtitle: `${movie.year}`,
      eyebrow: "watched",
      rating,
      liked,
    };
  });
</script>

<Link href={view.href} color="inherit">
  <div class="trakt-diary-entry">
    <CalendarTile date={watchedAt} />

    <img
      class="trakt-diary-entry-poster"
      src={view.poster}
      alt={view.title}
      loading="lazy"
    />

    <div class="trakt-diary-entry-meta">
      <p class="summary-eyebrow">{view.eyebrow}</p>
      <p class="trakt-diary-entry-title bold ellipsis">{view.title}</p>
      <p class="trakt-diary-entry-subtitle secondary ellipsis">
        {view.subtitle}
      </p>

      <div class="trakt-diary-entry-glyphs">
        <MediaRating value={view.rating} />
        {#if view.liked}
          <span class="trakt-diary-entry-heart" aria-label="liked">
            <FavoriteIcon />
          </span>
        {/if}
      </div>
    </div>
  </div>
</Link>

<style>
  .trakt-diary-entry {
    display: grid;
    grid-template-columns: auto var(--ni-44) 1fr;
    align-items: center;
    gap: var(--gap-s);

    padding: var(--gap-s) 0;
    border-bottom: var(--ni-1) solid
      color-mix(in srgb, var(--color-foreground) 6%, transparent);
  }

  .trakt-diary-entry-poster {
    width: var(--ni-44);
    aspect-ratio: 2 / 3;
    object-fit: cover;
    border-radius: var(--border-radius-xs);
  }

  .trakt-diary-entry-meta {
    display: flex;
    flex-direction: column;
    gap: var(--ni-2);
    min-width: 0;
  }

  .trakt-diary-entry-title {
    font-size: var(--font-size-text);
    color: var(--color-foreground);
  }

  .trakt-diary-entry-subtitle {
    font-size: var(--font-size-tag);
  }

  .trakt-diary-entry-glyphs {
    display: flex;
    align-items: center;
    gap: var(--gap-s);
    margin-top: var(--ni-4);
    min-height: var(--ni-16);
  }

  .trakt-diary-entry-heart {
    display: inline-flex;
    color: var(--tboxed-rating);
  }

  :global(.trakt-diary-entry-heart svg) {
    width: var(--ni-14);
    height: var(--ni-14);
  }
</style>
