<script lang="ts">
  import { useAuth } from "$lib/features/auth/stores/useAuth.ts";
  import { getLocale, languageTag } from "$lib/features/i18n/index.ts";
  import * as m from "$lib/features/i18n/messages.ts";
  import CrossOriginImage from "$lib/features/image/components/CrossOriginImage.svelte";
  import type { EpisodeEntry } from "$lib/requests/models/EpisodeEntry.ts";
  import type { ShowEntry } from "$lib/requests/models/ShowEntry.ts";
  import { EPISODE_COVER_PLACEHOLDER, PLACEHOLDERS } from "$lib/utils/assets.ts";
  import { toHumanDay } from "$lib/utils/formatting/date/toHumanDay.ts";
  import { toHumanDuration } from "$lib/utils/formatting/date/toHumanDuration.ts";
  import { toIMDBRating } from "$lib/utils/formatting/number/toIMDBRating.ts";
  import { episodeNumberLabel } from "$lib/utils/intl/episodeNumberLabel.ts";
  import { MAX_DATE } from "$lib/utils/constants.ts";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder.ts";
  import Stars from "../../components/Stars.svelte";
  import EpisodeWatchToggle from "./EpisodeWatchToggle.svelte";
  import { toEpisodeTypeLabel } from "./toEpisodeTypeLabel.ts";

  const STAR_SCALE = 5;

  type SeasonEpisodeRowProps = {
    show: ShowEntry;
    episode: EpisodeEntry;
    isWatched: boolean;
    isUpNext: boolean;
    userRating: number | null;
    now: Date;
  };

  const { show, episode, isWatched, isUpNext, userRating, now }: SeasonEpisodeRowProps =
    $props();

  const { isAuthorized } = useAuth();

  const code = $derived(
    episodeNumberLabel({ seasonNumber: episode.season, episodeNumber: episode.number }),
  );
  const href = $derived(UrlBuilder.episode(show.slug, episode.season, episode.number));
  const typeLabel = $derived(toEpisodeTypeLabel(episode.type));
  const hasDate = $derived(episode.airDate.getTime() !== MAX_DATE.getTime());
  const hasAired = $derived(episode.effectiveReleaseDate.getTime() <= now.getTime());
  const date = $derived(
    hasDate ? toHumanDay({ date: episode.airDate, locale: getLocale(), format: "short" }) : null,
  );
  const runtime = $derived(
    Number.isFinite(episode.runtime) && episode.runtime > 0
      ? toHumanDuration({ minutes: episode.runtime }, languageTag())
      : null,
  );
  const still = $derived(
    episode.cover.url && !PLACEHOLDERS.includes(episode.cover.url)
      ? episode.cover.url
      : EPISODE_COVER_PLACEHOLDER,
  );
</script>

<li
  class="boxed-episode-row"
  class:is-watched={isWatched}
  class:is-up-next={isUpNext}
>
  <a class="boxed-episode-still" {href} tabindex="-1" aria-hidden="true">
    <CrossOriginImage src={still} alt="" />
    {#if runtime}
      <span class="boxed-episode-runtime">{runtime}</span>
    {/if}
  </a>

  <div class="boxed-episode-text">
    <div class="boxed-episode-code">
      <span>{code}</span>
      {#if isUpNext}
        <span class="boxed-episode-chip" data-kind="up-next">{m.boxed_log_up_next()}</span>
      {:else if typeLabel}
        <span class="boxed-episode-chip">{typeLabel}</span>
      {/if}
    </div>
    <a class="boxed-episode-title" {href}>{episode.title || code}</a>
    <span class="boxed-episode-meta">
      {#if date}
        {hasAired
          ? m.boxed_show_aired_on({ date })
          : m.boxed_show_airs_on({ date })}
      {:else}
        {m.tag_text_tba()}
      {/if}
    </span>
    <p class="boxed-episode-overview">{episode.overview === "TBD" ? "" : episode.overview}</p>
  </div>

  <span class="boxed-episode-rating">
    {#if episode.rating}
      <span class="boxed-episode-star" aria-hidden="true">★</span>
      {toIMDBRating(episode.rating * STAR_SCALE, languageTag())}
    {/if}
  </span>

  {#if $isAuthorized}
    <div class="boxed-episode-state">
      <EpisodeWatchToggle {show} {episode} label={`${show.title} ${code}`} />
      <span class="boxed-episode-user-rating">
        {#if userRating}
          <Stars rating={userRating} />
        {/if}
      </span>
    </div>
  {/if}
</li>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .boxed-episode-row {
    --still-width: var(--ni-176);

    box-sizing: border-box;
    height: var(--ni-120);
    padding: var(--ni-10);

    display: grid;
    grid-template-columns: var(--still-width) minmax(0, 1fr) auto auto;
    align-items: center;
    column-gap: var(--ni-18);

    border-radius: var(--border-radius-m);
    border-bottom: var(--border-thickness-xxs) solid
      color-mix(in srgb, var(--color-border) 60%, transparent);

    &.is-up-next {
      background: color-mix(in srgb, var(--purple-500) 8%, var(--color-card-background));
      box-shadow: inset 0 0 0 var(--border-thickness-xxs)
        color-mix(in srgb, var(--purple-500) 45%, transparent);
    }
  }

  .boxed-episode-still {
    position: relative;
    display: block;
    aspect-ratio: 16 / 9;

    border-radius: var(--border-radius-s);
    overflow: hidden;
    background: var(--color-card-background);

    :global(img) {
      display: block;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .is-watched &::after {
      content: "";
      position: absolute;
      inset: 0;
      border-radius: inherit;
      box-shadow: inset 0 0 0 var(--border-thickness-xs) var(--boxed-color-watched);
      pointer-events: none;
    }
  }

  .boxed-episode-runtime {
    position: absolute;
    bottom: var(--ni-6);
    inset-inline-start: var(--ni-6);
    padding: var(--ni-2) var(--ni-4);

    border-radius: var(--border-radius-xs);
    background: color-mix(in srgb, var(--shade-950) 75%, transparent);
    color: var(--shade-10);

    font-family: "Roboto Mono", monospace;
    font-size: var(--ni-10);
  }

  .boxed-episode-text {
    min-width: 0;

    display: flex;
    flex-direction: column;
    gap: var(--ni-4);
  }

  .boxed-episode-code {
    height: var(--ni-18);

    display: flex;
    align-items: center;
    gap: var(--ni-8);

    font-family: "Roboto Mono", monospace;
    font-size: var(--ni-12);
    color: var(--color-text-secondary);

    span {
      font-size: inherit;
    }
  }

  .boxed-episode-chip {
    padding: var(--ni-2) var(--ni-8);

    border-radius: var(--border-radius-xxl);
    background: color-mix(in srgb, var(--boxed-color-watchlist) 18%, var(--color-card-background));
    color: var(--color-text-primary);

    font-family: inherit;
    font-size: var(--ni-10);
    font-weight: 500;
    white-space: nowrap;

    &[data-kind="up-next"] {
      background: var(--purple-500);
      color: var(--shade-10);
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.06em;
    }
  }

  .boxed-episode-title {
    font-family: var(--boxed-font-title);
    font-weight: 600;
    font-size: var(--ni-20);
    line-height: 1.25;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    text-decoration: none;
    color: var(--color-text-primary);

    &:hover,
    &:focus-visible {
      color: var(--color-link-active);
    }
  }

  .boxed-episode-meta {
    font-family: "Roboto Mono", monospace;
    font-size: var(--ni-12);
    color: var(--color-text-secondary);
  }

  .boxed-episode-overview {
    margin: 0;
    height: calc(var(--ni-14) * 1.5);

    font-size: var(--ni-14);
    line-height: 1.5;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    color: var(--color-text-secondary);
  }

  .boxed-episode-rating {
    min-width: var(--ni-56);
    height: var(--ni-28);
    padding: 0 var(--ni-10);
    box-sizing: border-box;

    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: var(--ni-4);

    border-radius: var(--border-radius-xxl);
    background: var(--color-card-background);

    font-size: var(--ni-12);
    color: var(--color-text-primary);
  }

  .boxed-episode-star {
    font-size: inherit;
    color: var(--boxed-color-star);
  }

  .boxed-episode-state {
    width: var(--ni-72);

    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--ni-6);
  }

  .boxed-episode-user-rating {
    height: var(--ni-12);
  }

  @include for-mobile {
    .boxed-episode-row {
      --still-width: var(--ni-104);

      height: var(--ni-80);
      padding: var(--ni-8) 0;
      column-gap: var(--ni-12);
      grid-template-columns: var(--still-width) minmax(0, 1fr) auto;
      border-radius: 0;

      &.is-up-next {
        padding-inline: var(--ni-8);
        border-radius: var(--border-radius-m);
      }
    }

    .boxed-episode-rating {
      display: none;
    }

    .boxed-episode-title {
      font-size: var(--ni-16);
    }

    .boxed-episode-overview {
      display: none;
    }

    .boxed-episode-state {
      width: auto;
    }
  }
</style>
