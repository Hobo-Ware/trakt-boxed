<script lang="ts">
  import { toStarAverage } from "$boxed/utils/toStarAverage.ts";
  import Skeleton from "$lib/components/skeleton/Skeleton.svelte";
  import { useUser } from "$lib/features/auth/stores/useUser.ts";
  import { languageTag } from "$lib/features/i18n/index.ts";
  import CrossOriginImage from "$lib/features/image/components/CrossOriginImage.svelte";
  import type { EpisodeEntry } from "$lib/requests/models/EpisodeEntry.ts";
  import type { ShowEntry } from "$lib/requests/models/ShowEntry.ts";
  import { EPISODE_COVER_PLACEHOLDER } from "$lib/utils/assets.ts";
  import { episodeNumberLabel } from "$lib/utils/intl/episodeNumberLabel.ts";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder.ts";
  import SectionHeader from "../../components/SectionHeader.svelte";

  const SKELETON_COUNT = 6;

  type SeasonEpisodeStripProps = {
    show: ShowEntry;
    title: string;
    allHref: string;
    episodes: ReadonlyArray<EpisodeEntry> | null;
    current: number;
  };

  const { show, title, allHref, episodes, current }: SeasonEpisodeStripProps =
    $props();

  const { history } = useUser();

  const watchedIds = $derived(
    new Set(
      $history?.shows.get(show.id)?.episodes.map((episode) => episode.episodeId) ?? [],
    ),
  );
</script>

<section class="boxed-episode-strip">
  <SectionHeader {title} href={allHref} />
  <ul class="boxed-episode-strip-list">
    {#if episodes === null}
      {#each { length: SKELETON_COUNT }, index (index)}
        <li class="boxed-strip-episode" aria-hidden="true">
          <span class="boxed-strip-still">
            <Skeleton height="100%" radius="var(--border-radius-m)" />
          </span>
          <Skeleton width="60%" height="var(--ni-12)" />
          <Skeleton width="80%" height="var(--ni-14)" />
        </li>
      {/each}
    {:else}
      {#each episodes as episode (episode.id)}
        <li>
          <a
            class="boxed-strip-episode"
            class:is-watched={watchedIds.has(episode.id)}
            class:is-current={episode.number === current}
            href={UrlBuilder.episode(show.slug, episode.season, episode.number)}
            aria-current={episode.number === current ? "page" : undefined}
          >
            <span class="boxed-strip-still">
              <CrossOriginImage src={episode.cover.url ?? EPISODE_COVER_PLACEHOLDER} alt="" />
            </span>
            <span class="boxed-strip-code">
              {episodeNumberLabel({ seasonNumber: episode.season, episodeNumber: episode.number })}
              {#if episode.rating}
                · ★ {toStarAverage(episode.rating, languageTag())}
              {/if}
            </span>
            <span class="boxed-strip-title">{episode.title}</span>
          </a>
        </li>
      {/each}
    {/if}
  </ul>
</section>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .boxed-episode-strip-list {
    margin: 0;
    padding: 0;
    list-style: none;

    display: grid;
    grid-auto-flow: column;
    grid-auto-columns: var(--ni-200);
    gap: var(--ni-14);

    overflow-x: auto;
    scrollbar-width: none;

    @include for-mobile {
      grid-auto-columns: var(--ni-160);
    }
  }

  .boxed-strip-episode {
    display: flex;
    flex-direction: column;
    gap: var(--ni-6);

    text-decoration: none;
    color: var(--color-text-primary);

    &:hover .boxed-strip-title,
    &:focus-visible .boxed-strip-title {
      color: var(--color-link-active);
    }
  }

  .boxed-strip-still {
    --still-ring: transparent;

    position: relative;
    display: block;
    aspect-ratio: 16 / 9;

    border-radius: var(--border-radius-m);
    overflow: hidden;
    background: var(--color-card-background);

    :global(img) {
      display: block;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    &::after {
      content: "";
      position: absolute;
      inset: 0;
      border-radius: inherit;
      box-shadow: inset 0 0 0 var(--border-thickness-xs) var(--still-ring);
      pointer-events: none;
    }

    .is-watched & {
      --still-ring: var(--boxed-color-watched);
    }

    .is-current & {
      --still-ring: var(--color-text-primary);
    }
  }

  .boxed-strip-code {
    height: var(--ni-16);

    font-family: var(--boxed-font-mono);
    font-size: var(--ni-11);
    line-height: var(--ni-16);
    color: var(--color-text-secondary);
  }

  .boxed-strip-title {
    height: var(--ni-18);

    font-size: var(--ni-14);
    font-weight: 500;
    line-height: var(--ni-18);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
</style>
