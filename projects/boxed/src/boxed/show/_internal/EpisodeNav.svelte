<script lang="ts">
  import CaretLeftIcon from "$lib/components/icons/CaretLeftIcon.svelte";
  import CaretRightIcon from "$lib/components/icons/CaretRightIcon.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import { episodeNumberLabel } from "$lib/utils/intl/episodeNumberLabel.ts";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder.ts";
  import type { EpisodeCoordinates } from "./toAdjacentEpisodes.ts";

  type EpisodeLink = EpisodeCoordinates & { title?: string };

  type EpisodeNavProps = {
    slug: string;
    previous: EpisodeLink | null;
    next: EpisodeLink | null;
  };

  const { slug, previous, next }: EpisodeNavProps = $props();

  const code = (link: EpisodeLink) =>
    episodeNumberLabel({ seasonNumber: link.season, episodeNumber: link.episode });
</script>

<nav class="boxed-episode-nav">
  {#if previous}
    <a
      class="boxed-episode-nav-link"
      href={UrlBuilder.episode(slug, previous.season, previous.episode)}
      aria-label={m.button_label_previous_episode()}
    >
      <CaretLeftIcon />
      <span class="boxed-episode-nav-text">
        <span class="boxed-episode-nav-code">{code(previous)}</span>
        <span class="boxed-episode-nav-title">{previous.title ?? ""}</span>
      </span>
    </a>
  {:else}
    <span></span>
  {/if}
  {#if next}
    <a
      class="boxed-episode-nav-link"
      data-direction="next"
      href={UrlBuilder.episode(slug, next.season, next.episode)}
      aria-label={m.button_label_next_episode()}
    >
      <span class="boxed-episode-nav-text">
        <span class="boxed-episode-nav-code">{code(next)}</span>
        <span class="boxed-episode-nav-title">{next.title ?? ""}</span>
      </span>
      <CaretRightIcon />
    </a>
  {/if}
</nav>

<style>
  .boxed-episode-nav {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: var(--ni-12);
  }

  .boxed-episode-nav-link {
    box-sizing: border-box;
    height: var(--ni-56);
    padding: 0 var(--ni-14);

    display: flex;
    align-items: center;
    gap: var(--ni-12);

    border-radius: var(--border-radius-m);
    background: color-mix(in srgb, var(--color-card-background) 85%, transparent);
    box-shadow: inset 0 0 0 var(--border-thickness-xxs) var(--color-border);
    text-decoration: none;
    color: var(--color-text-primary);

    :global(svg) {
      flex-shrink: 0;
      width: var(--ni-16);
      height: var(--ni-16);
      color: var(--color-text-secondary);
    }

    &[data-direction="next"] {
      justify-content: flex-end;
      text-align: end;
    }

    &:hover,
    &:focus-visible {
      box-shadow: inset 0 0 0 var(--border-thickness-xxs) var(--color-link-active);
    }
  }

  .boxed-episode-nav-text {
    flex: 1 1 0;
    min-width: 0;

    display: flex;
    flex-direction: column;
    gap: var(--ni-2);
  }

  .boxed-episode-nav-code {
    font-family: var(--boxed-font-mono);
    font-size: var(--ni-11);
    color: var(--color-text-secondary);
  }

  .boxed-episode-nav-title {
    height: var(--ni-18);

    font-size: var(--ni-14);
    font-weight: 500;
    line-height: var(--ni-18);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
</style>
