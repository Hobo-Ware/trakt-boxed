<script lang="ts">
  import CrossOriginImage from "$lib/features/image/components/CrossOriginImage.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { DiaryEpisodesEntry } from "./DiaryEntry.ts";
  import { toEpisodeStill } from "./_internal/toEpisodeStill.ts";

  const PILE_SIZE = 3;

  const {
    entry,
    isOpen,
    onToggle,
  }: { entry: DiaryEpisodesEntry; isOpen: boolean; onToggle: () => void } =
    $props();

  const stills = $derived(entry.plays.slice(-PILE_SIZE).map(toEpisodeStill));
</script>

<button
  type="button"
  class="boxed-binge-pile"
  class:is-open={isOpen}
  aria-expanded={isOpen}
  aria-label={m.boxed_profile_diary_toggle_label({ title: entry.show.title })}
  onclick={onToggle}
>
  {#each stills as still, index (index)}
    <span class="pile-still" style:--index={index}>
      <CrossOriginImage src={still} alt="" />
    </span>
  {/each}
  <span class="pile-count">{entry.plays.length}</span>
</button>

<style>
  .boxed-binge-pile {
    position: relative;
    flex-shrink: 0;
    width: var(--ni-104);
    height: var(--ni-80);
    padding: 0;
    border: none;
    background: none;
    cursor: pointer;
  }

  .pile-still {
    position: absolute;
    inset-inline-end: calc(var(--index) * var(--ni-14));
    top: calc(var(--index) * var(--ni-10));
    width: var(--ni-64);
    aspect-ratio: 16 / 9;
    border-radius: var(--border-radius-xs);
    overflow: hidden;
    background: var(--color-input-background);
    box-shadow: 0 var(--ni-2) var(--ni-8)
      color-mix(in srgb, var(--shade-950) 60%, transparent);
    transform: rotate(calc((var(--index) - 1) * 4deg));
    transition: transform calc(var(--transition-increment) * 2) ease;

    :global(img) {
      display: block;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .is-open .pile-still {
    transform: rotate(0deg) translateX(calc(var(--rtl-sign) * var(--index) * var(--ni-4)));
  }

  .pile-count {
    position: absolute;
    inset-inline-end: calc(-1 * var(--ni-6));
    bottom: 0;
    min-width: var(--ni-20);
    height: var(--ni-20);
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: var(--border-radius-xxl);
    background: var(--color-background);
    box-shadow: inset 0 0 0 var(--border-thickness-xxs) var(--color-border);
    font-size: var(--ni-11);
    font-weight: 600;
    color: var(--color-text-primary);
  }

  @media (prefers-reduced-motion: reduce) {
    .pile-still {
      transition: none;
    }
  }
</style>
