<script lang="ts">
  import Link from "$lib/components/link/Link.svelte";
  import type { Snippet } from "svelte";

  const {
    title,
    metaInfo,
    style,
    href,
    noscroll,
    replacestate,
  }: {
    title: string;
    metaInfo?: Snippet;
    href?: string;
    noscroll?: boolean;
    replacestate?: boolean;
    style: "primary" | "secondary";
  } = $props();
</script>

{#snippet content()}
  <span class="title shadow-list-title ellipsis" data-style={style}>
    {title}
  </span>
{/snippet}

<div class="trakt-list-title">
  {#if href}
    <Link {href} {noscroll} {replacestate}>{@render content()}</Link>
  {:else}
    {@render content()}
  {/if}

  {#if metaInfo}
    {@render metaInfo()}
  {/if}
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-list-title {
    display: flex;
    flex-direction: column;
    min-width: 0;

    :global(.trakt-link) {
      text-decoration: none;
    }
  }

  .shadow-list-title {
    &[data-style="primary"] {
      color: var(--color-text-primary);
    }

    &[data-style="secondary"] {
      color: var(--color-text-secondary);
    }

    /*
      Letterboxd section labels are 11-12px tracked uppercase — no
      mixed-case body title. The chrome that says "this is a section"
      is the typography itself, not surrounding card edges.
      Reference: research/notes/SUMMARY.md.
    */
    font-size: var(--ni-12);
    line-height: var(--ni-16);
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    &.ellipsis {
      max-width: 100%;
      width: 100%;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      display: block;
    }
  }
</style>
