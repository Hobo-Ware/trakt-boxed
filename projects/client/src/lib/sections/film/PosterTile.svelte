<script lang="ts">
  import type { MovieEntry } from '$lib/requests/models/MovieEntry.ts';
  import type { ShowEntry } from '$lib/requests/models/ShowEntry.ts';
  import { UrlBuilder } from '$lib/utils/url/UrlBuilder.ts';

  type Props = {
    entry: MovieEntry | ShowEntry;
    showTitle?: boolean;
  };

  const { entry, showTitle = false }: Props = $props();

  const href = $derived(
    entry.type === 'movie' ? UrlBuilder.movie(entry.slug) : UrlBuilder.show(entry.slug),
  );
</script>

<a class="poster-tile" {href} aria-label={entry.title}>
  <div class="poster-tile__frame">
    {#if entry.poster?.url?.thumb}
      <img
        class="poster-tile__image"
        src={entry.poster.url.thumb}
        alt={entry.title}
        loading="lazy"
      />
    {:else}
      <div class="poster-tile__placeholder" aria-hidden="true">
        <span>{entry.title}</span>
      </div>
    {/if}
  </div>
  {#if showTitle}
    <span class="poster-tile__title">{entry.title}</span>
  {/if}
</a>

<style lang="scss">
  .poster-tile {
    display: flex;
    flex-direction: column;
    gap: 6px;
    text-decoration: none;
    color: inherit;

    &__frame {
      position: relative;
      aspect-ratio: 2 / 3;
      border-radius: 3px;
      overflow: hidden;
      background: color-mix(in srgb, var(--shade-900) 70%, transparent);
      box-shadow:
        0 0 0 1px color-mix(in srgb, var(--shade-10) 6%, transparent) inset,
        0 8px 18px -10px rgba(0, 0, 0, 0.55);
      transition: transform 140ms ease, box-shadow 140ms ease;
    }

    &__image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }

    &__placeholder {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: var(--gap-s);
      font-family: var(--font-family-serif, Georgia, serif);
      color: var(--color-text-secondary);
      text-align: center;
      font-size: 0.85rem;
    }

    &__title {
      font-size: 0.8rem;
      color: var(--color-text-primary);
      line-height: 1.25;
      text-align: center;
    }

    &:hover .poster-tile__frame {
      box-shadow:
        0 0 0 2px var(--color-background-green, var(--green-500)),
        0 14px 28px -10px rgba(0, 0, 0, 0.6);
      transform: translateY(-1px);
    }

    &:focus-visible .poster-tile__frame {
      box-shadow:
        0 0 0 2px var(--color-background-green, var(--green-500)),
        0 14px 28px -10px rgba(0, 0, 0, 0.6);
      outline: none;
    }
  }
</style>
