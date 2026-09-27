<script lang="ts">
  import EmptyState from "$boxed/components/EmptyState.svelte";
  import FavoriteIcon from "$lib/components/icons/FavoriteIcon.svelte";
  import Skeleton from "$lib/components/skeleton/Skeleton.svelte";
  import { getLocale, languageTag } from "$lib/features/i18n";
  import * as m from "$lib/features/i18n/messages.ts";
  import CrossOriginImage from "$lib/features/image/components/CrossOriginImage.svelte";
  import { toHumanClockTime } from "$lib/utils/formatting/date/toHumanClockTime.ts";
  import { toHumanDayOfWeek } from "$lib/utils/formatting/date/toHumanDayOfWeek.ts";
  import { toHumanMonth } from "$lib/utils/formatting/date/toHumanMonth.ts";
  import { toIMDBRating } from "$lib/utils/formatting/number/toIMDBRating.ts";
  import { episodeNumberLabel } from "$lib/utils/intl/episodeNumberLabel.ts";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import Stars from "../../components/Stars.svelte";
  import BingePile from "./BingePile.svelte";
  import DiaryEntryActions from "./DiaryEntryActions.svelte";
  import type { DiaryEntry } from "./DiaryEntry.ts";
  import type { DiaryViewProps } from "./DiaryViewProps.ts";
  import RewatchMark from "./RewatchMark.svelte";
  import { isEntryLiked } from "./_internal/isEntryLiked.ts";
  import { toEntryMedia } from "./_internal/toEntryMedia.ts";
  import { toEntryRating } from "./_internal/toEntryRating.ts";
  import { toEntryTitle } from "./_internal/toEntryTitle.ts";
  import { toEpisodeRange } from "./_internal/toEpisodeRange.ts";
  import { toEpisodeRangeLabel } from "./_internal/toEpisodeRangeLabel.ts";
  import { toEpisodeStill } from "./_internal/toEpisodeStill.ts";

  const SKELETON_CARDS = 6;

  const {
    buckets,
    isMe,
    ratings,
    favorites,
    expanded,
    loadingMore,
  }: DiaryViewProps = $props();

  const toggle = (key: string) => {
    if (expanded.has(key)) expanded.delete(key);
    else expanded.add(key);
  };

  const toRatingText = (rating: number) => toIMDBRating(rating / 2, languageTag());
</script>

{#snippet skeletonCard()}
  <li class="diary-card" aria-hidden="true">
    <span class="diary-stub"><Skeleton width="var(--ni-32)" height="var(--ni-40)" /></span>
    <span class="diary-card-body">
      <span class="diary-card-poster"><Skeleton height="100%" /></span>
      <span class="diary-card-text">
        <Skeleton width="70%" height="var(--ni-18)" />
        <Skeleton width="40%" height="var(--ni-14)" />
      </span>
    </span>
  </li>
{/snippet}

{#snippet card(entry: DiaryEntry)}
  {@const media = toEntryMedia(entry)}
  {@const rating = toEntryRating({ entry, ratings })}
  {@const isGroup = entry.type === "episodes" && entry.plays.length > 1}
  {@const isOpen = expanded.has(entry.key)}
  <li class="diary-card">
    <span class="diary-stub">
      <span class="stub-month">{toHumanMonth(entry.watchedAt, languageTag(), "short")}</span>
      <span class="stub-day">{entry.watchedAt.getDate()}</span>
      <span class="stub-weekday">{toHumanDayOfWeek(entry.watchedAt, getLocale())}</span>
    </span>
    <span class="diary-card-body">
      {#if !isGroup}
        <a class="diary-card-poster" href={UrlBuilder.media(media.type, media.slug)} tabindex="-1" aria-hidden="true">
          <CrossOriginImage src={media.poster.url.thumb} alt="" />
        </a>
      {/if}
      <span class="diary-card-text">
        <span class="diary-card-title">
          <a href={UrlBuilder.media(media.type, media.slug)}>{toEntryTitle(entry)}</a>
          {#if media.year}<span class="diary-card-year">{media.year}</span>{/if}
        </span>
        {#if entry.type === "episodes"}
          <span class="diary-card-code">
            {toEpisodeRangeLabel(toEpisodeRange(entry.plays.map((play) => play.episode)))}
            {#if isGroup}· {m.boxed_profile_diary_binge()}{/if}
          </span>
        {/if}
        <span class="diary-card-meta">
          {#if rating !== null}
            <strong>{toRatingText(rating)}</strong>
            <Stars {rating} />
          {/if}
          {#if isEntryLiked({ entry, favorites })}
            <span class="diary-card-liked" role="img" aria-label={m.boxed_title_liked()}>
              <FavoriteIcon state="filled" />
            </span>
          {/if}
          {#if entry.isRewatch}<RewatchMark />{/if}
          {#if isMe}<DiaryEntryActions {entry} />{/if}
        </span>
      </span>
      {#if entry.type === "episodes" && isGroup}
        <BingePile {entry} {isOpen} onToggle={() => toggle(entry.key)} />
      {/if}
    </span>
    {#if entry.type === "episodes" && isGroup && isOpen}
      <ul class="diary-card-episodes">
        {#each entry.plays as play (play.key)}
          {@const episodeRating = ratings?.episodes.get(play.episode.id)?.rating ?? null}
          <li>
            <span class="episode-still">
              <CrossOriginImage src={toEpisodeStill(play)} alt="" />
              <span class="episode-code">
                {episodeNumberLabel({ seasonNumber: play.episode.season, episodeNumber: play.episode.number })}
              </span>
            </span>
            <span class="episode-title">{play.episode.title}</span>
            {#if episodeRating !== null}
              <span class="episode-rating">
                <strong>{toRatingText(episodeRating)}</strong>
                <Stars rating={episodeRating} />
              </span>
            {/if}
            <span class="episode-time">{toHumanClockTime(play.watchedAt, languageTag())}</span>
          </li>
        {/each}
      </ul>
    {/if}
  </li>
{/snippet}

<div class="boxed-diary-cards">
  {#if buckets === null}
    <ol class="diary-card-list">
      {#each { length: SKELETON_CARDS }, index (index)}
        {@render skeletonCard()}
      {/each}
    </ol>
  {:else if buckets.length === 0}
    <EmptyState text={m.boxed_profile_diary_empty()} />
  {:else}
    {#each buckets as bucket (bucket.key)}
      <section class="diary-month">
        <header class="diary-month-header">
          <span>{toHumanMonth(bucket.month, languageTag())} {bucket.month.getFullYear()}</span>
          <span class="diary-month-count">
            {m.boxed_profile_diary_entries({ count: bucket.entries.length })}
          </span>
        </header>
        <ol class="diary-card-list">
          {#each bucket.entries as entry (entry.key)}
            {@render card(entry)}
          {/each}
        </ol>
      </section>
    {/each}
    {#if loadingMore}
      <ol class="diary-card-list">
        {#each { length: 2 }, index (index)}
          {@render skeletonCard()}
        {/each}
      </ol>
    {/if}
  {/if}
</div>

<style>
  .boxed-diary-cards {
    display: flex;
    flex-direction: column;
    gap: var(--ni-16);
  }

  .diary-month {
    display: flex;
    flex-direction: column;
    gap: var(--ni-12);
  }

  .diary-month-header {
    position: sticky;
    top: var(--boxed-header-height);
    z-index: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: var(--ni-44);
    margin-inline: calc(-1 * var(--layout-distance-side));
    padding-inline: var(--layout-distance-side);
    background: var(--color-background);
    border-bottom: var(--border-thickness-xxs) solid var(--color-border);

    font-size: var(--ni-14);
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--boxed-color-accent-text);
  }

  .diary-month-count {
    font-size: var(--ni-12);
    font-weight: 500;
    letter-spacing: 0;
    text-transform: none;
    color: var(--color-text-secondary);
  }

  .diary-card-list {
    margin: 0;
    padding: 0;
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: var(--ni-12);
  }

  .diary-card {
    display: grid;
    grid-template-columns: var(--ni-72) minmax(0, 1fr);
    min-height: var(--ni-104);
    border-radius: var(--border-radius-m);
    background: var(--color-card-background);
    box-shadow: inset 0 0 0 var(--border-thickness-xxs) var(--color-border);
  }

  .diary-stub {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: var(--ni-2);
    border-inline-end: var(--border-thickness-xs) dashed var(--color-border);

    &::before,
    &::after {
      content: "";
      position: absolute;
      inset-inline-end: calc(-1 * var(--ni-8));
      width: var(--ni-14);
      height: var(--ni-14);
      border-radius: 50%;
      background: var(--color-background);
    }

    &::before {
      top: calc(-1 * var(--ni-8));
    }

    &::after {
      bottom: calc(-1 * var(--ni-8));
    }
  }

  .stub-month,
  .stub-weekday {
    font-family: var(--boxed-font-mono);
    font-size: var(--ni-11);
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--boxed-color-accent-text);
  }

  .stub-weekday {
    color: var(--color-text-secondary);
  }

  .stub-day {
    font-family: var(--boxed-font-title);
    font-size: var(--ni-28);
    font-weight: 600;
    line-height: 1;
  }

  .diary-card-body {
    display: flex;
    align-items: center;
    gap: var(--gap-s);
    padding: var(--ni-12);
    min-width: 0;
  }

  .diary-card-poster {
    flex-shrink: 0;
    width: var(--ni-48);
    aspect-ratio: 2 / 3;
    border-radius: var(--ni-2);
    overflow: hidden;
    background: var(--color-input-background);

    :global(img) {
      display: block;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .diary-card-text {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: var(--ni-4);
  }

  .diary-card-title {
    display: flex;
    align-items: baseline;
    gap: var(--ni-6);
    min-width: 0;

    a {
      min-width: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      font-family: var(--boxed-font-title);
      font-size: var(--ni-18);
      font-weight: 600;
      color: var(--color-text-primary);
      text-decoration: none;
    }
  }

  .diary-card-year,
  .diary-card-code,
  .episode-time {
    flex-shrink: 0;
    font-family: var(--boxed-font-mono);
    font-size: var(--ni-12);
    color: var(--color-text-secondary);
  }

  .diary-card-code {
    color: var(--boxed-color-accent-text);
  }

  .diary-card-meta,
  .episode-rating {
    display: flex;
    align-items: center;
    gap: var(--ni-6);
    min-height: var(--ni-32);

    strong {
      font-size: var(--ni-16);
    }
  }

  .diary-card-liked {
    display: flex;
    color: var(--boxed-color-liked-text);

    :global(svg) {
      width: var(--ni-14);
      height: var(--ni-14);
    }
  }

  .diary-card-episodes {
    grid-column: 1 / -1;
    margin: 0;
    padding: var(--ni-12);
    list-style: none;
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: var(--gap-s);
    border-top: var(--border-thickness-xs) dashed var(--color-border);

    li {
      display: flex;
      flex-direction: column;
      gap: var(--ni-4);
      min-width: 0;
    }
  }

  .episode-still {
    position: relative;
    aspect-ratio: 16 / 9;
    border-radius: var(--border-radius-xs);
    overflow: hidden;
    background: var(--color-input-background);

    :global(img) {
      display: block;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .episode-code {
    position: absolute;
    inset-inline-start: var(--ni-6);
    bottom: var(--ni-4);
    font-family: var(--boxed-font-mono);
    font-size: var(--ni-11);
    color: var(--shade-10);
    text-shadow: 0 0 var(--ni-4) var(--shade-950);
  }

  .episode-title {
    font-family: var(--boxed-font-title);
    font-size: var(--ni-14);
    font-weight: 600;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
</style>
