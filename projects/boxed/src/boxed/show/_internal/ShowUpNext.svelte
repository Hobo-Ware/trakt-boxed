<script lang="ts">
  import Skeleton from "$lib/components/skeleton/Skeleton.svelte";
  import { getLocale, languageTag } from "$lib/features/i18n/index.ts";
  import * as m from "$lib/features/i18n/messages.ts";
  import CrossOriginImage from "$lib/features/image/components/CrossOriginImage.svelte";
  import { useQuery } from "$lib/features/query/useQuery.ts";
  import type { ShowEntry } from "$lib/requests/models/ShowEntry.ts";
  import { showProgressQuery } from "$lib/requests/queries/shows/showProgressQuery.ts";
  import { EPISODE_COVER_PLACEHOLDER } from "$lib/utils/assets.ts";
  import { toHumanDay } from "$lib/utils/formatting/date/toHumanDay.ts";
  import { toHumanDuration } from "$lib/utils/formatting/date/toHumanDuration.ts";
  import { episodeNumberLabel } from "$lib/utils/intl/episodeNumberLabel.ts";
  import { toLoadingState } from "$lib/utils/requests/toLoadingState.ts";
  import { fromRune } from "$lib/utils/store/fromRune.svelte.ts";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder.ts";
  import { map } from "rxjs";
  import NextEpisodeActions from "./NextEpisodeActions.svelte";

  const { show }: { show: ShowEntry } = $props();

  const query = useQuery(
    fromRune(() => show.slug).pipe(map((slug) => showProgressQuery({ slug }))),
  );

  const isLoading = $derived(toLoadingState($query));
  const progress = $derived(
    Number.isFinite($query.data?.total) ? $query.data : undefined,
  );
  const next = $derived(progress && progress.id > 0 ? progress : null);
  const ratio = $derived(
    progress && progress.total > 0
      ? Math.min(progress.completed / progress.total, 1)
      : 0,
  );

  const duration = (minutes: number) =>
    toHumanDuration({ minutes }, languageTag());
</script>

<section class="boxed-show-up-next" aria-label={m.boxed_log_up_next()}>
  <header class="boxed-show-progress">
    <span class="boxed-show-progress-label">{m.boxed_show_your_progress()}</span>
    <span class="boxed-show-progress-count">
      {#if progress}
        {m.boxed_show_episodes_watched({
          watched: progress.completed,
          total: progress.total,
        })}
        {#if progress.minutesLeft > 0}
          <span class="boxed-show-progress-left">
            · {m.tag_text_remaining_duration({
              duration: duration(progress.minutesLeft),
            })}
          </span>
        {/if}
      {/if}
    </span>
    <span
      class="boxed-show-progress-bar"
      style:--progress={`${Math.round(ratio * 100)}%`}
      aria-hidden="true"
    ></span>
  </header>

  <div class="boxed-show-next">
    <div class="boxed-show-next-still">
      {#if isLoading}
        <Skeleton height="100%" radius="var(--border-radius-m)" />
      {:else if next}
        <CrossOriginImage src={next.cover.url ?? EPISODE_COVER_PLACEHOLDER} alt="" />
        <span class="boxed-show-next-chip">{m.boxed_log_up_next()}</span>
      {/if}
    </div>

    <div class="boxed-show-next-body">
      {#if isLoading}
        <Skeleton width="40%" height="var(--ni-16)" />
        <Skeleton width="70%" height="calc(var(--ni-28) * 1.2)" />
        <Skeleton width="50%" height="var(--ni-16)" />
        <Skeleton height="var(--ni-40)" radius="var(--border-radius-m)" />
      {:else if next}
        <span class="boxed-show-next-code">
          {episodeNumberLabel({ seasonNumber: next.season, episodeNumber: next.number })}
          · {m.tag_text_remaining_episodes({ count: next.remaining })}
        </span>
        <a
          class="boxed-show-next-title"
          href={UrlBuilder.episode(show.slug, next.season, next.number)}
        >
          {next.title}
        </a>
        <span class="boxed-show-next-meta">
          {m.boxed_show_aired_on({
            date: toHumanDay({ date: next.airDate, locale: getLocale(), format: "short" }),
          })}
          {#if Number.isFinite(next.runtime)}
            · {duration(next.runtime)}
          {/if}
        </span>
        <NextEpisodeActions {show} episode={next} />
      {:else}
        <span class="boxed-show-next-done">{m.text_season_complete()}</span>
        <p class="boxed-show-next-empty">{m.boxed_show_up_next_empty()}</p>
      {/if}
    </div>
  </div>
</section>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .boxed-show-up-next {
    display: flex;
    flex-direction: column;

    border-radius: var(--border-radius-m);
    overflow: hidden;
    background: var(--color-card-background);
    box-shadow: inset 0 0 0 var(--border-thickness-xxs)
      color-mix(in srgb, var(--color-foreground) 6%, transparent);
  }

  .boxed-show-progress {
    box-sizing: border-box;
    padding: var(--ni-12) var(--ni-16);

    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    align-items: center;
    row-gap: var(--ni-8);
    column-gap: var(--ni-12);

    border-bottom: var(--border-thickness-xxs) solid var(--color-border);
  }

  .boxed-show-progress-label {
    font-size: var(--ni-12);
    font-weight: 500;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--color-text-secondary);
  }

  .boxed-show-progress-count {
    max-width: var(--ni-340);
    height: var(--ni-16);

    font-family: "Roboto Mono", monospace;
    font-size: var(--ni-12);
    line-height: var(--ni-16);
    text-align: end;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    color: var(--color-text-primary);
  }

  .boxed-show-progress-left {
    font-size: inherit;
    color: var(--boxed-color-watched-text);
  }

  .boxed-show-progress-bar {
    grid-column: 1 / -1;
    position: relative;
    height: var(--ni-4);

    border-radius: var(--border-radius-xxl);
    background: var(--color-border);
    overflow: hidden;

    &::after {
      content: "";
      position: absolute;
      inset-block: 0;
      inset-inline-start: 0;
      width: var(--progress);

      border-radius: inherit;
      background: var(--boxed-color-watched);
      transition: width calc(var(--transition-increment) * 3) ease;
    }
  }

  .boxed-show-next {
    padding: var(--ni-16);

    display: grid;
    grid-template-columns: var(--ni-240) minmax(0, 1fr);
    gap: var(--ni-20);
  }

  .boxed-show-next-still {
    position: relative;
    aspect-ratio: 16 / 9;

    border-radius: var(--border-radius-m);
    overflow: hidden;
    background: var(--color-background);

    :global(img) {
      display: block;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .boxed-show-next-chip {
    position: absolute;
    inset-block-start: var(--ni-8);
    inset-inline-start: var(--ni-8);
    padding: var(--ni-2) var(--ni-8);

    border-radius: var(--border-radius-xxl);
    background: var(--purple-500);
    color: var(--shade-10);

    font-size: var(--ni-10);
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
  }

  .boxed-show-next-body {
    min-width: 0;
    min-height: var(--ni-136);

    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: var(--ni-6);
  }

  .boxed-show-next-code,
  .boxed-show-next-meta {
    height: var(--ni-16);

    font-family: "Roboto Mono", monospace;
    font-size: var(--ni-12);
    line-height: var(--ni-16);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    color: var(--color-text-secondary);
  }

  .boxed-show-next-title {
    height: calc(var(--ni-28) * 1.2);

    font-family: var(--boxed-font-title);
    font-weight: 600;
    font-size: var(--ni-28);
    line-height: 1.2;
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

  .boxed-show-next-meta {
    margin-bottom: var(--ni-6);
  }

  .boxed-show-next-done {
    font-weight: 600;
    font-size: var(--ni-24);
    color: var(--color-text-primary);
  }

  .boxed-show-next-empty {
    margin: 0;

    font-size: var(--ni-14);
    line-height: 1.5;
    color: var(--color-text-secondary);
  }

  @include for-mobile {
    .boxed-show-next {
      grid-template-columns: minmax(0, 1fr);
      gap: var(--ni-14);
    }

    .boxed-show-next-title {
      height: calc(var(--ni-24) * 1.2);
      font-size: var(--ni-24);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .boxed-show-progress-bar::after {
      transition: none;
    }
  }
</style>
