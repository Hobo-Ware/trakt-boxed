<script lang="ts">
  import EmptyState from "$boxed/components/EmptyState.svelte";
  import CaretRightIcon from "$lib/components/icons/CaretRightIcon.svelte";
  import FavoriteIcon from "$lib/components/icons/FavoriteIcon.svelte";
  import Skeleton from "$lib/components/skeleton/Skeleton.svelte";
  import { languageTag } from "$lib/features/i18n";
  import * as m from "$lib/features/i18n/messages.ts";
  import CrossOriginImage from "$lib/features/image/components/CrossOriginImage.svelte";
  import { toHumanClockTime } from "$lib/utils/formatting/date/toHumanClockTime.ts";
  import { toHumanMonth } from "$lib/utils/formatting/date/toHumanMonth.ts";
  import { episodeNumberLabel } from "$lib/utils/intl/episodeNumberLabel.ts";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import Stars from "../../components/Stars.svelte";
  import BingePile from "./BingePile.svelte";
  import DiaryEntryActions from "./DiaryEntryActions.svelte";
  import type { DiaryEntry } from "./DiaryEntry.ts";
  import type { DiaryViewProps } from "./DiaryViewProps.ts";
  import RewatchMark from "./RewatchMark.svelte";
  import { isEntryLiked } from "./isEntryLiked.ts";
  import { toEntryMedia } from "./toEntryMedia.ts";
  import { toEntryRating } from "./toEntryRating.ts";
  import { toEntryTitle } from "./_internal/toEntryTitle.ts";
  import { toEpisodeRange } from "./toEpisodeRange.ts";
  import { toEpisodeRangeLabel } from "./toEpisodeRangeLabel.ts";

  const SKELETON_ROWS = 10;

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

  const pad = (day: number) => String(day).padStart(2, "0");
</script>

{#snippet skeletonRow()}
  <div class="diary-row" aria-hidden="true">
    <span></span>
    <span><Skeleton width="var(--ni-32)" height="var(--ni-24)" /></span>
    <span class="diary-thumb"><Skeleton height="100%" /></span>
    <span><Skeleton width="50%" height="var(--ni-18)" /></span>
  </div>
{/snippet}

{#snippet entryRow(entry: DiaryEntry, isFirstOfMonth: boolean, month: Date)}
  {@const media = toEntryMedia(entry)}
  {@const rating = toEntryRating({ entry, ratings })}
  {@const isGroup = entry.type === "episodes" && entry.plays.length > 1}
  {@const isOpen = expanded.has(entry.key)}
  <div class="diary-row" role="row" class:is-open={isOpen}>
    <span class="diary-month" role="cell">
      {#if isFirstOfMonth}
        <span class="diary-ribbon">
          <span>{toHumanMonth(month, languageTag(), "short")}</span>
          <span class="diary-ribbon-year">{month.getFullYear()}</span>
        </span>
      {/if}
    </span>
    <span class="diary-day" role="cell">{pad(entry.watchedAt.getDate())}</span>
    {#if entry.type === "episodes" && isGroup}
      <span class="diary-pile" role="cell">
        <BingePile {entry} {isOpen} size="compact" onToggle={() => toggle(entry.key)} />
      </span>
    {:else}
      <a class="diary-thumb" href={UrlBuilder.media(media.type, media.slug)} tabindex="-1" aria-hidden="true">
        <CrossOriginImage src={media.poster.url.thumb} alt="" />
      </a>
    {/if}
    <span class="diary-title" role="cell">
      <a class="diary-title-link" href={UrlBuilder.media(media.type, media.slug)}>
        {toEntryTitle(entry)}
      </a>
      {#if entry.type === "episodes"}
        <span class="diary-sub">
          <span class="diary-code">
            {toEpisodeRangeLabel(toEpisodeRange(entry.plays.map((play) => play.episode)))}
          </span>
          {#if isGroup}
            <span>{m.text_stats_episodes_count({ count: String(entry.plays.length) })}</span>
            <button
              type="button"
              class="diary-toggle"
              class:is-open={isOpen}
              aria-expanded={isOpen}
              aria-label={m.boxed_profile_diary_toggle_label({ title: entry.show.title })}
              onclick={() => toggle(entry.key)}
            >
              <CaretRightIcon />
            </button>
          {/if}
        </span>
      {/if}
    </span>
    <span class="diary-mono" role="cell">{media.year ?? ""}</span>
    <span role="cell">{#if rating !== null}<Stars {rating} size="normal" />{/if}</span>
    <span class="diary-like" role="cell">
      {#if isEntryLiked({ entry, favorites })}
        <span role="img" aria-label={m.boxed_title_liked()}><FavoriteIcon state="filled" /></span>
      {/if}
    </span>
    <span role="cell">{#if entry.isRewatch}<RewatchMark />{/if}</span>
    <span role="cell">{#if isMe}<DiaryEntryActions {entry} />{/if}</span>
  </div>

  {#if entry.type === "episodes" && isGroup && isOpen}
    {#each entry.plays as play (play.key)}
      {@const episodeRating = ratings?.episodes.get(play.episode.id)?.rating ?? null}
      <div class="diary-row diary-subrow" role="row">
        <span></span>
        <span></span>
        <span class="diary-rail" aria-hidden="true"></span>
        <span class="diary-title diary-episode" role="cell">
          <span class="diary-code">
            {episodeNumberLabel({ seasonNumber: play.episode.season, episodeNumber: play.episode.number })}
          </span>
          <span class="diary-episode-title">{play.episode.title}</span>
          <span class="diary-mono">{toHumanClockTime(play.watchedAt, languageTag())}</span>
        </span>
        <span class="diary-mono" role="cell">{play.episode.year}</span>
        <span role="cell">{#if episodeRating !== null}<Stars rating={episodeRating} />{/if}</span>
        <span></span>
        <span></span>
        <span></span>
      </div>
    {/each}
  {/if}
{/snippet}

<div class="boxed-diary-table" role="table">
  <div class="diary-row diary-head" role="row">
    <span role="columnheader">{m.boxed_profile_diary_col_month()}</span>
    <span role="columnheader">{m.boxed_profile_diary_col_day()}</span>
    <span></span>
    <span role="columnheader">{m.button_text_sort_title()}</span>
    <span role="columnheader">{m.tag_text_released()}</span>
    <span role="columnheader">{m.button_text_sort_rating()}</span>
    <span role="columnheader">{m.boxed_log_like()}</span>
    <span role="columnheader">{m.boxed_log_rewatch()}</span>
    <span role="columnheader">{isMe ? m.boxed_profile_diary_col_edit() : ""}</span>
  </div>

  {#if buckets === null}
    {#each { length: SKELETON_ROWS }, index (index)}
      {@render skeletonRow()}
    {/each}
  {:else if buckets.length === 0}
    <EmptyState text={m.boxed_profile_diary_empty()} />
  {:else}
    {#each buckets as bucket (bucket.key)}
      {#each bucket.entries as entry, index (entry.key)}
        {@render entryRow(entry, index === 0, bucket.month)}
      {/each}
    {/each}
    {#if loadingMore}
      {#each { length: 3 }, index (index)}
        {@render skeletonRow()}
      {/each}
    {/if}
  {/if}
</div>

<style>
  .boxed-diary-table {
    --diary-columns: var(--ni-80) var(--ni-52) var(--ni-40) minmax(0, 1fr)
      var(--ni-88) var(--ni-120) var(--ni-56) var(--ni-72) var(--ni-52);

    display: flex;
    flex-direction: column;
  }

  .diary-row {
    display: grid;
    grid-template-columns: var(--diary-columns);
    align-items: center;
    column-gap: var(--gap-s);
    min-height: var(--ni-72);
    border-bottom: var(--border-thickness-xxs) solid var(--color-border);

    &.is-open {
      background: color-mix(in srgb, var(--color-card-background) 60%, transparent);
      border-bottom-color: transparent;
    }
  }

  .diary-head {
    min-height: var(--ni-36);
    font-size: var(--ni-11);
    font-weight: 500;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--color-text-secondary);
  }

  .diary-subrow {
    min-height: var(--ni-44);
    background: color-mix(in srgb, var(--color-card-background) 60%, transparent);
    border-bottom-color: transparent;

    &:last-of-type {
      border-bottom-color: var(--color-border);
    }
  }

  .diary-ribbon {
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    padding: var(--ni-6) var(--ni-14);
    border-radius: var(--border-radius-s);
    background: var(--purple-500);
    color: var(--shade-10);
    font-size: var(--ni-14);
    font-weight: 700;
    text-transform: uppercase;
    line-height: 1.1;
  }

  .diary-ribbon-year {
    font-size: var(--ni-10);
    font-weight: 500;
  }

  .diary-day {
    font-size: var(--ni-28);
    font-weight: 300;
    text-align: end;
    color: var(--color-text-secondary);
    font-variant-numeric: tabular-nums;
  }

  .diary-thumb {
    display: block;
    width: var(--ni-36);
    aspect-ratio: 2 / 3;
    border-radius: var(--ni-2);
    overflow: hidden;
    background: var(--color-card-background);

    :global(img) {
      display: block;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .diary-pile {
    display: flex;
  }

  .diary-title {
    display: flex;
    flex-direction: column;
    gap: var(--ni-2);
    min-width: 0;
  }

  .diary-title-link {
    font-family: var(--boxed-font-title);
    font-size: var(--ni-18);
    font-weight: 600;
    color: var(--color-text-primary);
    text-decoration: none;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;

    &:hover {
      text-decoration: underline;
    }
  }

  .diary-sub {
    display: flex;
    align-items: center;
    gap: var(--ni-8);
    font-size: var(--ni-12);
    color: var(--color-text-secondary);
  }

  .diary-code {
    font-family: var(--boxed-font-mono);
    font-size: var(--ni-12);
    color: var(--boxed-color-accent-text);
    white-space: nowrap;
  }

  .diary-toggle {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: var(--ni-24);
    height: var(--ni-24);
    padding: 0;
    border: none;
    border-radius: var(--border-radius-s);
    background: var(--color-input-background);
    color: var(--color-text-secondary);
    cursor: pointer;

    :global(svg) {
      width: var(--ni-12);
      height: var(--ni-12);
      transform: rotate(90deg);
      transition: transform var(--transition-increment) ease;
    }

    &.is-open :global(svg) {
      transform: rotate(-90deg);
    }
  }

  .diary-episode {
    flex-direction: row;
    align-items: baseline;
    gap: var(--gap-s);
  }

  .diary-episode-title {
    font-family: var(--boxed-font-title);
    font-size: var(--ni-16);
    font-weight: 600;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .diary-rail {
    justify-self: center;
    width: var(--border-thickness-xs);
    height: var(--ni-20);
    background: var(--purple-500);
  }

  .diary-mono {
    font-family: var(--boxed-font-mono);
    font-size: var(--ni-12);
    color: var(--color-text-secondary);
  }

  .diary-like {
    color: var(--boxed-color-liked-text);

    :global(svg) {
      width: var(--ni-14);
      height: var(--ni-14);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .diary-toggle :global(svg) {
      transition: none;
    }
  }
</style>
