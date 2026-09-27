<script lang="ts">
  import CheckIcon from "$lib/components/icons/CheckIcon.svelte";
  import { languageTag } from "$lib/features/i18n";
  import CrossOriginImage from "$lib/features/image/components/CrossOriginImage.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { UpNextEntry } from "$lib/requests/models/UpNextEntry.ts";
  import { useMarkAsWatched } from "$lib/sections/media-actions/mark-as-watched/useMarkAsWatched.ts";
  import { toHumanDuration } from "$lib/utils/formatting/date/toHumanDuration.ts";
  import { episodeNumberLabel } from "$lib/utils/intl/episodeNumberLabel.ts";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import { useIsWatched } from "$lib/sections/media-actions/mark-as-watched/useIsWatched.ts";
  import { useUpNextUndo } from "./_internal/useUpNextUndo.ts";

  const { entry }: { entry: UpNextEntry } = $props();

  const { lastMark, remember, clear } = useUpNextUndo();

  const toEpisodeActions = (episode: UpNextEntry) =>
    useMarkAsWatched({
      type: "episode",
      media: episode,
      show: { id: episode.show.id, title: episode.show.title },
      isToastEnabled: false,
    });

  const { markAsWatched, isMarkingAsWatched } = $derived(toEpisodeActions(entry));
  const { isWatched } = $derived(
    useIsWatched({
      type: "episode",
      media: entry,
      show: { id: entry.show.id, title: entry.show.title },
    }),
  );

  const marked = $derived(
    $lastMark?.show.id === entry.show.id ? $lastMark : null,
  );
  const markedActions = $derived(marked ? toEpisodeActions(marked) : null);
  const markedCode = $derived(
    marked
      ? episodeNumberLabel({ seasonNumber: marked.season, episodeNumber: marked.number })
      : null,
  );

  const markWatched = async () => {
    const target = entry;
    const hasEarlierPlays = $isWatched;
    if (!hasEarlierPlays) remember(target);
    await markAsWatched().catch(() => clear(target));
  };

  const revertWatched = async () => {
    const target = marked;
    const actions = markedActions;
    if (!target || !actions) return;

    clear(target);
    await actions.removeWatched();
  };

  const progress = $derived(
    entry.total > 0 ? Math.min(entry.completed / entry.total, 1) : 0,
  );
  const code = $derived(
    episodeNumberLabel({
      seasonNumber: entry.season,
      episodeNumber: entry.number,
    }),
  );
</script>

<article class="boxed-up-next">
  <a
    class="boxed-up-next-still"
    href={UrlBuilder.show(entry.show.slug)}
    aria-label={entry.show.title}
  >
    <CrossOriginImage
      src={entry.cover.url ?? entry.show.cover.url.thumb}
      alt=""
    />
    <span
      class="boxed-up-next-progress"
      style:--progress={`${Math.round(progress * 100)}%`}
      aria-hidden="true"
    ></span>
  </a>

  <div class="boxed-up-next-body">
    <div class="boxed-up-next-text">
      <a class="boxed-up-next-show" href={UrlBuilder.show(entry.show.slug)}>
        {entry.show.title}
      </a>
      <span class="boxed-up-next-episode">
        {code}{#if entry.title}&nbsp;· {entry.title}{/if}
      </span>
      {#if markedCode}
        <span class="boxed-up-next-meta is-marked">
          <span>{m.boxed_home_up_next_marked({ code: markedCode })}</span>
          <button
            type="button"
            class="boxed-up-next-undo"
            aria-label={m.action_toast_label_undo()}
            onclick={revertWatched}
          >
            {m.button_text_undo()}
          </button>
        </span>
      {:else}
        <span class="boxed-up-next-meta">
          {m.tag_text_remaining_episodes({ count: entry.remaining })}
          {#if entry.minutesLeft > 0}
            · {m.tag_text_remaining_duration({
              duration: toHumanDuration(
                { minutes: entry.minutesLeft },
                languageTag(),
              ),
            })}
          {/if}
        </span>
      {/if}
    </div>
    <button
      type="button"
      class="boxed-up-next-check"
      class:is-marked={marked !== null}
      aria-label={m.button_label_mark_as_watched({
        title: `${entry.show.title} ${code}`,
      })}
      disabled={$isMarkingAsWatched}
      onclick={markWatched}
    >
      <CheckIcon />
    </button>
  </div>
</article>

<style>
  .boxed-up-next {
    display: flex;
    flex-direction: column;
    gap: var(--gap-s);
    min-width: 0;
  }

  .boxed-up-next-still {
    position: relative;
    display: block;
    aspect-ratio: 16 / 9;
    border-radius: var(--border-radius-m);
    overflow: hidden;
    background: var(--color-card-background);
    box-shadow: inset 0 0 0 var(--border-thickness-xxs)
      color-mix(in srgb, var(--color-foreground) 10%, transparent);

    :global(img) {
      display: block;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .boxed-up-next-progress {
    position: absolute;
    inset-inline: 0;
    bottom: 0;
    height: var(--ni-4);
    background: color-mix(in srgb, var(--shade-950) 60%, transparent);

    &::after {
      content: "";
      position: absolute;
      inset-block: 0;
      inset-inline-start: 0;
      width: var(--progress);
      background: var(--boxed-color-watched);
      transition: width calc(var(--transition-increment) * 3) ease;
    }
  }

  .boxed-up-next-body {
    min-height: var(--ni-64);
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: var(--gap-s);
  }

  .boxed-up-next-text {
    display: flex;
    flex-direction: column;
    gap: var(--ni-2);
    min-width: 0;
  }

  .boxed-up-next-show {
    font-family: var(--boxed-font-title);
    font-size: var(--ni-18);
    font-weight: 600;
    line-height: 1.25;
    color: var(--color-text-primary);
    text-decoration: none;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .boxed-up-next-episode {
    font-size: var(--ni-14);
    color: var(--color-text-primary);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .boxed-up-next-meta {
    height: var(--ni-18);
    font-size: var(--ni-12);
    line-height: var(--ni-18);
    color: var(--color-text-secondary);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;

    &.is-marked {
      color: var(--boxed-color-watched-text);
      font-weight: 500;
    }
  }

  .boxed-up-next-undo {
    margin-inline-start: var(--ni-8);
    padding: 0;
    border: none;
    background: none;
    cursor: pointer;

    font: inherit;
    color: var(--color-link-active);
    text-decoration: underline;
  }

  .boxed-up-next-check {
    flex-shrink: 0;
    width: var(--ni-40);
    height: var(--ni-40);
    display: flex;
    align-items: center;
    justify-content: center;

    border: none;
    border-radius: 50%;
    background: transparent;
    box-shadow: inset 0 0 0 var(--border-thickness-xs) var(--boxed-color-watched);
    color: var(--boxed-color-watched-text);
    cursor: pointer;

    :global(svg) {
      width: var(--ni-18);
      height: var(--ni-18);
    }

    &.is-marked,
    &:hover:not(:disabled),
    &:focus-visible {
      background: var(--boxed-color-watched);
      color: var(--shade-950);
    }

    &:disabled {
      opacity: 0.5;
      cursor: progress;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .boxed-up-next-progress::after {
      transition: none;
    }
  }
</style>
