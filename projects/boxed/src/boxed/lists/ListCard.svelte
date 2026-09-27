<script lang="ts">
  import FavoriteIcon from "$lib/components/icons/FavoriteIcon.svelte";
  import CrossOriginImage from "$lib/features/image/components/CrossOriginImage.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { MediaListSummary } from "$lib/requests/models/MediaListSummary.ts";
  import { getListUrl } from "$lib/sections/lists/components/list-summary/getListUrl.ts";

  const FAN_SIZE = 5;

  const {
    list,
    variant = "row",
  }: { list: MediaListSummary; variant?: "row" | "tile" } = $props();

  const posters = $derived(list.posters.slice(0, FAN_SIZE));
  const blanks = $derived(Math.max(FAN_SIZE - posters.length, 0));
</script>

<a class="boxed-list-card" data-variant={variant} href={getListUrl({ type: "user-list", list })}>
  <span class="boxed-list-fan" aria-hidden="true">
    {#each posters as poster, index (index)}
      <span class="boxed-list-fan-poster">
        <CrossOriginImage src={poster.url.thumb} alt="" />
      </span>
    {/each}
    {#each { length: blanks }, index (index)}
      <span class="boxed-list-fan-poster is-blank"></span>
    {/each}
  </span>
  <span class="boxed-list-text">
    <span class="boxed-list-title">{list.name}</span>
    <span class="boxed-list-meta" data-hj-suppress>
      <img
        class="boxed-list-avatar"
        src={list.user.avatar.url}
        alt=""
        width="18"
        height="18"
        loading="lazy"
      />
      <span>{list.user.username}</span>
      <span>· {m.label_list_item_count({ count: list.count })}</span>
      {#if list.likeCount > 0}
        <span class="boxed-list-likes">
          <FavoriteIcon state="filled" />{list.likeCount}
        </span>
      {/if}
    </span>
    {#if list.description}
      <span class="boxed-list-description">{list.description}</span>
    {/if}
  </span>
</a>

<style>
  .boxed-list-card {
    display: grid;
    grid-template-columns: var(--ni-200) minmax(0, 1fr);
    align-items: center;
    gap: var(--gap-l);
    padding: var(--ni-8);
    border-radius: var(--border-radius-m);
    color: inherit;
    text-decoration: none;

    &:hover,
    &:focus-visible {
      background: var(--color-input-background);
    }

    &[data-variant="tile"] {
      grid-template-columns: minmax(0, 1fr);
      align-items: start;
    }
  }

  .boxed-list-fan {
    display: grid;
    grid-template-columns: repeat(5, minmax(0, 1fr));
    padding-inline-end: 11%;
  }

  .boxed-list-fan-poster {
    display: block;
    aspect-ratio: 2 / 3;
    width: 160%;
    border-radius: var(--border-radius-xs);
    overflow: hidden;
    background: var(--color-card-background);
    box-shadow:
      0 0 0 var(--border-thickness-xxs) var(--color-background),
      var(--ni-4) 0 var(--ni-12) color-mix(in srgb, var(--shade-950) 60%, transparent);

    &:nth-child(1) { z-index: 5; }
    &:nth-child(2) { z-index: 4; }
    &:nth-child(3) { z-index: 3; }
    &:nth-child(4) { z-index: 2; }
    &:nth-child(5) { z-index: 1; }

    &.is-blank {
      background: var(--color-input-background);
    }

    :global(img) {
      display: block;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .boxed-list-text {
    display: flex;
    flex-direction: column;
    gap: var(--ni-6);
    min-width: 0;
  }

  .boxed-list-title {
    font-family: var(--boxed-font-title);
    font-size: var(--ni-20);
    font-weight: 600;
    line-height: 1.25;
    color: var(--color-text-primary);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .boxed-list-meta {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: var(--ni-6);
    font-size: var(--ni-12);
    color: var(--color-text-secondary);

    span {
      font-size: inherit;
    }
  }

  .boxed-list-avatar {
    width: var(--ni-18);
    height: var(--ni-18);
    border-radius: 50%;
    object-fit: cover;
    background: var(--color-input-background);
  }

  .boxed-list-likes {
    display: inline-flex;
    align-items: center;
    gap: var(--ni-2);
    color: var(--boxed-color-liked-text);

    :global(svg) {
      width: var(--ni-12);
      height: var(--ni-12);
    }
  }

  .boxed-list-description {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    font-size: var(--ni-14);
    line-height: 1.5;
    color: var(--color-text-secondary);
  }
</style>
