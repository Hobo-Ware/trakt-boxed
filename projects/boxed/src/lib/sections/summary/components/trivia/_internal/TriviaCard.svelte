<script lang="ts">
  import Spoiler from "$lib/features/spoilers/components/Spoiler.svelte";
  import type { MediaEntry } from "$lib/requests/models/MediaEntry";
  import type { MediaTrivia } from "$lib/requests/models/MediaTrivia";
  import { createSafeMarked } from "$lib/utils/markdown/createSafeMarked.ts";

  const {
    trivia,
    media,
  }: {
    trivia: MediaTrivia;
    media: MediaEntry;
  } = $props();

  const marked = createSafeMarked();
</script>

{#snippet parsedContent()}
  {@html marked.parse(trivia.text)}
{/snippet}

<article class="trakt-trivia-card">
  {#if !trivia.isSpoiler}
    {@render parsedContent()}
  {:else}
    <Spoiler {media} type={media.type}>
      {@render parsedContent()}
    </Spoiler>
  {/if}
</article>

<style lang="scss">
  .trakt-trivia-card {
    display: flex;
    flex-direction: column;
    gap: var(--ni-8);

    padding-block: var(--ni-16);
    border-bottom: var(--border-thickness-xxs) solid var(--color-border);

    font-size: var(--ni-14);
    line-height: 1.55;
    color: var(--color-text-primary);

    :global(p) {
      margin: 0;
    }

    :global(.trakt-spoiler) {
      cursor: pointer;
    }
  }
</style>
