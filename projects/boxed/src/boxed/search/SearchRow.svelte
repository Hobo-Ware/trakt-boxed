<script lang="ts">
  import CrossOriginImage from "$lib/features/image/components/CrossOriginImage.svelte";
  import type { Snippet } from "svelte";

  type SearchRowProps = {
    href: string;
    image: string | Nil;
    shape: "poster" | "round";
    title: string;
    meta: string;
    aside?: Snippet;
    onclick?: () => void;
  };

  const { href, image, shape, title, meta, aside, onclick }: SearchRowProps =
    $props();
</script>

<a class="boxed-search-row" {href} {onclick}>
  <span class="boxed-search-thumb" data-shape={shape}>
    {#if image}<CrossOriginImage src={image} alt="" />{/if}
  </span>
  <span class="boxed-search-text">
    <span class="boxed-search-title">{title}</span>
    <span class="boxed-search-meta">{meta}</span>
  </span>
  {@render aside?.()}
</a>

<style>
  .boxed-search-row {
    display: flex;
    align-items: center;
    gap: var(--gap-m);
    min-height: var(--ni-88);
    padding: var(--ni-8);

    border-radius: var(--border-radius-m);
    color: inherit;
    text-decoration: none;

    &:hover,
    &:focus-visible {
      background: var(--color-input-background);
    }
  }

  .boxed-search-thumb {
    flex-shrink: 0;
    width: var(--ni-48);
    aspect-ratio: 2 / 3;
    overflow: hidden;
    border-radius: var(--border-radius-xs);
    background: var(--color-input-background);

    &[data-shape="round"] {
      width: var(--ni-56);
      aspect-ratio: 1;
      border-radius: 50%;
    }

    :global(img) {
      display: block;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .boxed-search-text {
    display: flex;
    flex-direction: column;
    gap: var(--ni-4);
    min-width: 0;
    flex: 1;
  }

  .boxed-search-title {
    font-family: var(--boxed-font-title);
    font-size: var(--ni-20);
    font-weight: 600;
    line-height: 1.25;
    color: var(--color-text-primary);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .boxed-search-meta {
    font-size: var(--ni-14);
    color: var(--color-text-secondary);
  }
</style>
