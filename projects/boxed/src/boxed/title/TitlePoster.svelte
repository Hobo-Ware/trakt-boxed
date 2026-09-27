<script lang="ts">
  import EyeIcon from "$lib/components/icons/EyeIcon.svelte";
  import FavoriteIcon from "$lib/components/icons/FavoriteIcon.svelte";
  import ListIcon from "$lib/components/icons/mobile/ListIcon.svelte";
  import { languageTag } from "$lib/features/i18n/index.ts";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { MediaStats } from "$lib/requests/models/MediaStats.ts";
  import { toHumanNumber } from "$lib/utils/formatting/number/toHumanNumber.ts";
  import type { PosterMedia } from "../poster/PosterMedia.ts";
  import { usePosterState } from "../poster/usePosterState.ts";
  import PosterFrame from "./PosterFrame.svelte";

  type TitlePosterProps = {
    media: PosterMedia;
    watchCount: number;
    stats: MediaStats | Nil;
    href?: string;
    hasStats?: boolean;
  };

  const {
    media,
    watchCount,
    stats,
    href,
    hasStats = true,
  }: TitlePosterProps = $props();

  const { outline, progress } = $derived(usePosterState(media));

  const watchedLabel = $derived(
    watchCount > 1
      ? m.boxed_title_watched_times({ count: watchCount })
      : m.tag_text_watched(),
  );

  const statItems = $derived([
    {
      key: "watchers",
      label: m.stat_text_watchers(),
      value: stats?.watchers,
      icon: EyeIcon,
    },
    { key: "lists", label: m.stat_text_lists(), value: stats?.lists, icon: ListIcon },
    {
      key: "favorited",
      label: m.stat_text_favorited(),
      value: stats?.favorited,
      icon: FavoriteIcon,
    },
  ]);
</script>

<div class="boxed-title-poster">
  <PosterFrame
    src={media.poster.url.medium}
    alt={m.image_alt_media_poster({ title: media.title })}
    {href}
    outline={$outline}
    progress={$progress}
  />

  <span class="boxed-title-watched" class:is-visible={watchCount > 0}>
    <EyeIcon />
    {watchedLabel}
  </span>

  {#if hasStats}
    <dl class="boxed-title-stats">
      {#each statItems as item (item.key)}
        {@const Icon = item.icon}
        <div class="boxed-title-stat" data-stat={item.key}>
          <dt aria-label={item.label}><Icon /></dt>
          <dd>{item.value == null ? "" : toHumanNumber(item.value, languageTag())}</dd>
        </div>
      {/each}
    </dl>
  {/if}
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .boxed-title-poster {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--ni-12);
  }

  .boxed-title-watched {
    height: var(--ni-28);
    padding: 0 var(--ni-12);
    box-sizing: border-box;

    display: inline-flex;
    align-items: center;
    gap: var(--gap-xs);

    border-radius: var(--border-radius-xxl);
    background: color-mix(in srgb, var(--boxed-color-watched) 14%, transparent);
    box-shadow: inset 0 0 0 var(--border-thickness-xxs)
      color-mix(in srgb, var(--boxed-color-watched) 45%, transparent);
    color: var(--boxed-color-watched-text);
    font-size: var(--ni-12);
    white-space: nowrap;

    visibility: hidden;

    &.is-visible {
      visibility: visible;
    }

    :global(svg) {
      width: var(--ni-16);
      height: var(--ni-16);
    }
  }

  .boxed-title-stats {
    margin: 0;
    height: var(--ni-16);

    display: grid;
    grid-template-columns: repeat(3, var(--ni-64));
    justify-content: center;
    gap: var(--ni-4);
  }

  .boxed-title-stat {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: var(--ni-4);

    font-size: var(--ni-12);
    color: var(--color-text-secondary);

    dt {
      display: flex;
    }

    dd {
      margin: 0;
    }

    :global(svg) {
      width: var(--ni-14);
      height: var(--ni-14);
    }

    &[data-stat="watchers"] dt {
      color: var(--boxed-color-watched-text);
    }

    &[data-stat="lists"] dt {
      color: var(--boxed-color-watchlist-text);
    }

    &[data-stat="favorited"] dt {
      color: var(--boxed-color-liked-text);
    }
  }

  @include for-tablet-lg-and-below {
    .boxed-title-poster {
      gap: var(--ni-8);
    }

    .boxed-title-watched {
      height: var(--ni-22);
      padding: 0 var(--ni-8);
      font-size: var(--ni-11);

      :global(svg) {
        width: var(--ni-12);
        height: var(--ni-12);
      }
    }

    .boxed-title-stats {
      display: none;
    }
  }
</style>
