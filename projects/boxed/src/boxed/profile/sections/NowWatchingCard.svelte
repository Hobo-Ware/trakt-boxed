<script lang="ts">
  import { languageTag } from "$lib/features/i18n";
  import * as m from "$lib/features/i18n/messages.ts";
  import CrossOriginImage from "$lib/features/image/components/CrossOriginImage.svelte";
  import { useQuery } from "$lib/features/query/useQuery.ts";
  import { userWatchingQuery } from "$lib/requests/queries/users/userWatchingQuery.ts";
  import { toHumanClockTime } from "$lib/utils/formatting/date/toHumanClockTime.ts";
  import { episodeNumberLabel } from "$lib/utils/intl/episodeNumberLabel.ts";
  import { toLoadingState } from "$lib/utils/requests/toLoadingState.ts";
  import { fromRune } from "$lib/utils/store/fromRune.svelte";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import { map } from "rxjs";

  const { slug }: { slug: string } = $props();

  const query = useQuery(
    fromRune(() => slug).pipe(map((slug) => userWatchingQuery({ slug }))),
  );
  const watching = $derived($query.data);
  const isLoading = $derived(toLoadingState($query));

  const now = Date.now();
  const title = $derived(
    watching?.type === "episode" ? watching.show.title : watching?.media.title,
  );
  const poster = $derived(
    watching?.type === "episode"
      ? watching.show.poster.url.thumb
      : watching?.media.poster.url.thumb,
  );
  const href = $derived.by(() => {
    if (!watching) return "";
    return watching.type === "episode"
      ? UrlBuilder.show(watching.show.slug)
      : UrlBuilder.movie(watching.media.slug);
  });
  const progress = $derived.by(() => {
    if (!watching) return 0;
    const total = watching.expiresAt.getTime() - watching.startedAt.getTime();
    const elapsed = now - watching.startedAt.getTime();
    return total > 0 ? Math.min(Math.max(elapsed / total, 0), 1) : 0;
  });
</script>

<div class="boxed-now-watching" class:is-live={Boolean(watching)}>
  <a
    class="now-poster"
    class:is-empty={!watching}
    href={href || undefined}
    aria-label={title}
  >
    {#if poster}
      <CrossOriginImage src={poster} alt="" />
    {/if}
  </a>
  <div class="now-body">
    {#if watching}
      <span class="now-live">
        <span class="now-dot" aria-hidden="true"></span>
        {m.boxed_title_tab_watching_now()}
      </span>
      <a class="now-title" {href}>{title}</a>
      {#if watching.type === "episode"}
        <span class="now-episode">
          <span class="now-code">
            {episodeNumberLabel({
              seasonNumber: watching.media.season,
              episodeNumber: watching.media.number,
            })}
          </span>
          {watching.media.title}
        </span>
      {/if}
      <span class="now-window">
        {m.boxed_profile_watching_window({
          start: toHumanClockTime(watching.startedAt, languageTag()),
          end: toHumanClockTime(watching.expiresAt, languageTag()),
        })}
      </span>
      <span
        class="now-progress"
        style:--progress={`${Math.round(progress * 100)}%`}
        aria-hidden="true"
      ></span>
    {:else if !isLoading}
      <span class="now-empty">{m.boxed_profile_not_watching()}</span>
    {/if}
  </div>
</div>

<style>
  .boxed-now-watching {
    box-sizing: border-box;
    height: var(--ni-176);
    display: flex;
    gap: var(--gap-m);
    padding: var(--ni-16);

    border-radius: var(--border-radius-l);
    background: var(--color-card-background);
    box-shadow: inset 0 0 0 var(--border-thickness-xxs) var(--color-border);
  }

  .now-poster {
    flex-shrink: 0;
    width: var(--ni-96);
    aspect-ratio: 2 / 3;
    border-radius: var(--border-radius-s);
    overflow: hidden;
    background: var(--color-input-background);

    :global(img) {
      display: block;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .now-poster.is-empty {
    visibility: hidden;
  }

  .now-body {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: var(--ni-4);
  }

  .now-live {
    display: inline-flex;
    align-items: center;
    gap: var(--ni-6);
    font-size: var(--ni-11);
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--boxed-color-watched);
  }

  .now-dot {
    width: var(--ni-8);
    height: var(--ni-8);
    border-radius: 50%;
    background: var(--boxed-color-watched);
    animation: boxed-live-pulse 1.6s ease-in-out infinite;
  }

  .now-title {
    font-family: var(--boxed-font-title);
    font-size: var(--ni-22);
    font-weight: 600;
    line-height: 1.2;
    color: var(--color-text-primary);
    text-decoration: none;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .now-episode {
    font-size: var(--ni-14);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .now-code {
    font-family: "Roboto Mono", monospace;
    font-size: var(--ni-12);
    color: var(--purple-300);
    margin-inline-end: var(--ni-6);
  }

  .now-window {
    font-family: "Roboto Mono", monospace;
    font-size: var(--ni-12);
    color: var(--color-text-secondary);
  }

  .now-progress {
    position: relative;
    height: var(--ni-4);
    margin-top: var(--ni-8);
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

  .now-empty {
    font-size: var(--ni-14);
    color: var(--color-text-secondary);
  }

  @keyframes boxed-live-pulse {
    50% {
      opacity: 0.35;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .now-dot {
      animation: none;
    }
  }
</style>
