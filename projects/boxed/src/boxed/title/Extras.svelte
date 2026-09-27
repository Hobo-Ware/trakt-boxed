<script lang="ts">
  import PlayIcon from "$lib/components/icons/PlayIcon.svelte";
  import CrossOriginImage from "$lib/features/image/components/CrossOriginImage.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { MediaVideo } from "$lib/requests/models/MediaVideo.ts";
  import { toTranslatedVideoType } from "$lib/utils/formatting/string/toTranslatedVideoType.ts";
  import SectionHeader from "../components/SectionHeader.svelte";

  const PREVIEW_COUNT = 3;

  const { videos, allHref }: { videos: ReadonlyArray<MediaVideo>; allHref: string } =
    $props();

  const preview = $derived(videos.slice(0, PREVIEW_COUNT));
</script>

<section class="boxed-extras">
  <SectionHeader title={m.list_title_extras()} href={allHref} />
  <ul class="boxed-extras-grid">
    {#each preview as video (video.key)}
      <li>
        <a class="boxed-extra" href={video.url} target="_blank" rel="noopener noreferrer">
          <span class="boxed-extra-frame">
            <CrossOriginImage src={video.thumbnail} alt="" />
            <span class="boxed-extra-play" aria-hidden="true"><PlayIcon /></span>
            <span class="boxed-extra-type">{toTranslatedVideoType(video.type)}</span>
          </span>
          <span class="boxed-extra-title">{video.title}</span>
        </a>
      </li>
    {/each}
  </ul>
</section>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .boxed-extras-grid {
    margin: 0;
    padding: 0;
    list-style: none;

    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: var(--ni-16);

    @include for-tablet-lg-and-below {
      grid-auto-flow: column;
      grid-template-columns: none;
      grid-auto-columns: var(--ni-240);
      gap: var(--ni-12);
      overflow-x: auto;
      scrollbar-width: none;
    }
  }

  .boxed-extra {
    display: flex;
    flex-direction: column;
    gap: var(--ni-8);

    text-decoration: none;
    color: var(--color-text-primary);

    &:hover .boxed-extra-play,
    &:focus-visible .boxed-extra-play {
      background: var(--purple-500);
    }
  }

  .boxed-extra-frame {
    position: relative;
    aspect-ratio: 16 / 9;

    display: flex;
    align-items: center;
    justify-content: center;

    border-radius: var(--border-radius-m);
    overflow: hidden;
    background: var(--color-card-background);

    :global(img) {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .boxed-extra-play {
    position: relative;
    width: var(--ni-44);
    height: var(--ni-44);

    display: flex;
    align-items: center;
    justify-content: center;

    border-radius: 50%;
    background: color-mix(in srgb, var(--shade-950) 70%, transparent);
    color: var(--shade-10);
    transition: background var(--transition-increment) ease;

    :global(svg) {
      width: var(--ni-20);
      height: var(--ni-20);
    }
  }

  .boxed-extra-type {
    position: absolute;
    bottom: var(--ni-8);
    inset-inline-end: var(--ni-8);
    padding: var(--ni-2) var(--ni-6);

    border-radius: var(--border-radius-xs);
    background: color-mix(in srgb, var(--shade-950) 80%, transparent);
    color: var(--shade-10);

    font-family: "Roboto Mono", monospace;
    font-size: var(--ni-11);
    text-transform: uppercase;
  }

  .boxed-extra-title {
    height: var(--ni-20);

    font-size: var(--ni-14);
    line-height: var(--ni-20);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
</style>
