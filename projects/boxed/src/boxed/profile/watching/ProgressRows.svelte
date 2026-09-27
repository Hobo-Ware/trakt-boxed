<script lang="ts">
  import Skeleton from "$lib/components/skeleton/Skeleton.svelte";
  import { getLocale } from "$lib/features/i18n";
  import * as m from "$lib/features/i18n/messages.ts";
  import CrossOriginImage from "$lib/features/image/components/CrossOriginImage.svelte";
  import type { ProgressEntry } from "$lib/requests/models/ProgressEntry.ts";
  import { toHumanDay } from "$lib/utils/formatting/date/toHumanDay.ts";
  import { toTranslatedStatus } from "$lib/utils/formatting/string/toTranslatedStatus.ts";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";

  const SKELETON_ROWS = 6;

  const {
    entries,
    loadingMore,
  }: { entries: ReadonlyArray<ProgressEntry> | null; loadingMore: boolean } =
    $props();

  const toDate = (entry: ProgressEntry) =>
    entry.type === "dropped" ? entry.hiddenAt : entry.lastWatchedAt;
</script>

{#snippet skeletonRow()}
  <li class="progress-row" aria-hidden="true">
    <span class="progress-poster"><Skeleton height="100%" /></span>
    <span class="progress-title"><Skeleton width="60%" height="var(--ni-18)" /></span>
  </li>
{/snippet}

<ol class="boxed-progress-rows">
  {#if entries === null}
    {#each { length: SKELETON_ROWS }, index (index)}
      {@render skeletonRow()}
    {/each}
  {:else if entries.length === 0}
    <li class="progress-empty">{m.boxed_profile_empty()}</li>
  {:else}
    {#each entries as entry (entry.key)}
      {@const date = toDate(entry)}
      <li class="progress-row">
        <a class="progress-poster" href={UrlBuilder.show(entry.show.slug)} tabindex="-1" aria-hidden="true">
          <CrossOriginImage src={entry.show.poster.url.thumb} alt="" />
        </a>
        <span class="progress-title">
          <a href={UrlBuilder.show(entry.show.slug)}>{entry.show.title}</a>
          <span class="progress-sub">
            {[entry.show.network, toTranslatedStatus(entry.show.status)]
              .filter(Boolean)
              .join(" · ")}
          </span>
        </span>
        {#if entry.type === "watched"}
          <span class="progress-bar">
            <span
              class="progress-track"
              style:--progress={`${entry.total > 0 ? Math.round((entry.completed / entry.total) * 100) : 0}%`}
            ></span>
            <span class="progress-count">
              {m.tooltip_text_watched_episodes({
                completed: entry.completed,
                total: entry.total,
              })}
            </span>
          </span>
        {:else}
          <span></span>
        {/if}
        <span class="progress-date">
          {date ? toHumanDay({ date, locale: getLocale(), format: "short" }) : ""}
        </span>
      </li>
    {/each}
    {#if loadingMore}
      {#each { length: 2 }, index (index)}
        {@render skeletonRow()}
      {/each}
    {/if}
  {/if}
</ol>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .boxed-progress-rows {
    margin: 0;
    padding: 0;
    list-style: none;
  }

  .progress-row {
    display: grid;
    grid-template-columns: var(--ni-44) minmax(0, 1.2fr) minmax(0, 1.4fr) var(--ni-120);
    align-items: center;
    gap: var(--gap-l);
    min-height: var(--ni-88);
    border-bottom: var(--border-thickness-xxs) solid var(--color-border);

    @include for-mobile {
      grid-template-columns: var(--ni-44) minmax(0, 1fr);
      row-gap: var(--ni-6);
      padding-block: var(--ni-12);

      .progress-bar {
        grid-column: 2;
      }

      .progress-date {
        display: none;
      }
    }
  }

  .progress-poster {
    display: block;
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

  .progress-title {
    display: flex;
    flex-direction: column;
    gap: var(--ni-2);
    min-width: 0;

    a {
      font-family: var(--boxed-font-title);
      font-size: var(--ni-18);
      font-weight: 600;
      line-height: var(--ni-24);
      color: var(--color-text-primary);
      text-decoration: none;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }

  .progress-sub,
  .progress-date {
    font-size: var(--ni-12);
    line-height: var(--ni-16);
    color: var(--color-text-secondary);
  }

  .progress-date {
    font-family: var(--boxed-font-mono);
    text-align: end;
  }

  .progress-bar {
    display: flex;
    flex-direction: column;
    gap: var(--ni-6);
  }

  .progress-track {
    position: relative;
    height: var(--ni-4);
    border-radius: var(--border-radius-xxl);
    background: var(--color-input-background);
    overflow: hidden;

    &::after {
      content: "";
      position: absolute;
      inset-block: 0;
      inset-inline-start: 0;
      width: var(--progress);
      background: var(--boxed-color-watched);
    }
  }

  .progress-count {
    font-family: var(--boxed-font-mono);
    font-size: var(--ni-12);
    line-height: var(--ni-16);
    color: var(--color-text-secondary);
  }

  .progress-empty {
    min-height: var(--ni-240);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--color-text-secondary);
  }
</style>
