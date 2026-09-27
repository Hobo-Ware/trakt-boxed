<script lang="ts">
  import { toStarAverage } from "$boxed/utils/toStarAverage.ts";
  import { useUser } from "$lib/features/auth/stores/useUser.ts";
  import { languageTag } from "$lib/features/i18n/index.ts";
  import * as m from "$lib/features/i18n/messages.ts";
  import CrossOriginImage from "$lib/features/image/components/CrossOriginImage.svelte";
  import type { Season } from "$lib/requests/models/Season.ts";
  import type { ShowEntry } from "$lib/requests/models/ShowEntry.ts";
  import { isMaxDate } from "$lib/utils/date/isMaxDate.ts";
  import { seasonLabel } from "$lib/utils/intl/seasonLabel.ts";
  import SectionHeader from "../../components/SectionHeader.svelte";
  import { toSeasonHref } from "$boxed/utils/toSeasonHref.ts";
  import { toSeasonStrip } from "./toSeasonStrip.ts";


  const { show, seasons }: { show: ShowEntry; seasons: ReadonlyArray<Season> } =
    $props();

  const { history } = useUser();

  const items = $derived(
    toSeasonStrip({
      seasons,
      watchedBySeason: $history?.shows.get(show.id)?.playsPerSeason ?? new Map(),
    }),
  );
  const hasProgress = $derived(items.some((item) => item.watched > 0));
  const firstSeason = $derived(items.at(0)?.season.number ?? 1);
</script>

<section class="boxed-show-seasons">
  <SectionHeader
    title={m.list_title_seasons()}
    href={toSeasonHref(show.slug, firstSeason)}
    linkLabel={m.boxed_show_all_episodes()}
  />

  <ul class="boxed-show-seasons-strip">
    {#each items as item (item.season.id)}
      {@const label = seasonLabel(item.season.number)}
      <li>
        <a
          class="boxed-show-season"
          class:is-complete={item.isComplete}
          href={toSeasonHref(show.slug, item.season.number)}
        >
          <span class="boxed-show-season-poster">
            <CrossOriginImage
              src={item.season.poster?.url.thumb ?? show.poster.url.thumb}
              alt={m.image_alt_media_poster({ title: label })}
            />
            <span
              class="boxed-show-season-bar"
              style:--progress={`${Math.round(item.ratio * 100)}%`}
              aria-hidden="true"
            ></span>
          </span>
          <span class="boxed-show-season-text">
            <span class="boxed-show-season-name">{label}</span>
            <span class="boxed-show-season-rating">
              {#if item.season.rating}
                ★ {toStarAverage(item.season.rating, languageTag())}
              {/if}
            </span>
            <span class="boxed-show-season-meta">
              {m.boxed_show_episode_count({ count: item.season.episodes.count })}
              {#if !isMaxDate(item.season.airDate)}
                · {item.season.airDate.getFullYear()}
              {/if}
            </span>
            <span class="boxed-show-season-progress" class:is-hidden={!hasProgress}>
              {item.isComplete
                ? m.tag_text_watched()
                : m.boxed_show_episodes_watched({ watched: item.watched, total: item.total })}
            </span>
          </span>
        </a>
      </li>
    {/each}
  </ul>
</section>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .boxed-show-seasons-strip {
    margin: 0;
    padding: 0;
    list-style: none;

    display: grid;
    grid-auto-flow: column;
    grid-auto-columns: var(--ni-240);
    gap: var(--ni-12);

    overflow-x: auto;
    scrollbar-width: none;

    @include for-mobile {
      grid-auto-columns: var(--ni-208);
    }
  }

  .boxed-show-season {
    box-sizing: border-box;
    height: var(--ni-132);
    padding: var(--ni-12);

    display: flex;
    gap: var(--ni-12);

    border-radius: var(--border-radius-m);
    background: var(--color-card-background);
    box-shadow: inset 0 0 0 var(--border-thickness-xxs)
      color-mix(in srgb, var(--color-foreground) 6%, transparent);
    text-decoration: none;
    color: var(--color-text-primary);

    &:hover,
    &:focus-visible {
      box-shadow: inset 0 0 0 var(--border-thickness-xxs) var(--color-link-active);
    }
  }

  .boxed-show-season-poster {
    position: relative;
    flex-shrink: 0;
    width: var(--ni-72);
    aspect-ratio: 2 / 3;

    border-radius: var(--border-radius-s);
    overflow: hidden;
    background: var(--color-background);

    :global(img) {
      display: block;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .is-complete & {
      outline: var(--border-thickness-xs) solid var(--boxed-color-watched);
    }
  }

  .boxed-show-season-bar {
    position: absolute;
    inset-inline: 0;
    bottom: 0;
    height: var(--ni-3);
    background: color-mix(in srgb, var(--shade-950) 60%, transparent);

    &::after {
      content: "";
      position: absolute;
      inset-block: 0;
      inset-inline-start: 0;
      width: var(--progress);
      background: var(--boxed-color-watched);
    }
  }

  .boxed-show-season-text {
    min-width: 0;

    display: flex;
    flex-direction: column;
    gap: var(--ni-4);
  }

  .boxed-show-season-name {
    font-family: var(--boxed-font-title);
    font-weight: 600;
    font-size: var(--ni-16);
    line-height: 1.25;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .boxed-show-season-rating {
    height: var(--ni-16);

    font-size: var(--ni-12);
    color: var(--boxed-color-star-text);
  }

  .boxed-show-season-meta,
  .boxed-show-season-progress {
    font-family: var(--boxed-font-mono);
    font-size: var(--ni-11);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    color: var(--color-text-secondary);
  }

  .boxed-show-season-progress {
    margin-top: auto;

    .is-complete & {
      color: var(--boxed-color-watched-text);
    }

    &.is-hidden {
      visibility: hidden;
    }
  }
</style>
