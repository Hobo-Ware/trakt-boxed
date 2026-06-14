<script lang="ts">
  import type { MovieEntry } from '$lib/requests/models/MovieEntry.ts';
  import type { ShowEntry } from '$lib/requests/models/ShowEntry.ts';
  import { onMount } from 'svelte';
  import HomeHero from './HomeHero.svelte';

  type Props = {
    entries: ReadonlyArray<MovieEntry | ShowEntry>;
    intervalMs?: number;
  };

  const { entries, intervalMs = 7000 }: Props = $props();

  let index = $state(0);
  const safeEntries = $derived(entries.filter(Boolean));
  const active = $derived(safeEntries[index] ?? safeEntries[0]);

  let timer: ReturnType<typeof setInterval> | null = null;
  let paused = $state(false);

  const tick = () => {
    if (safeEntries.length < 2) return;
    index = (index + 1) % safeEntries.length;
  };

  const start = () => {
    if (timer) return;
    if (safeEntries.length < 2) return;
    timer = setInterval(() => {
      if (!paused) tick();
    }, intervalMs);
  };

  const stop = () => {
    if (timer) clearInterval(timer);
    timer = null;
  };

  onMount(() => {
    start();
    return stop;
  });

  $effect(() => {
    if (safeEntries.length < 2) stop();
    else start();
  });
</script>

{#if active}
  <div
    class="home-carousel"
    onmouseenter={() => (paused = true)}
    onmouseleave={() => (paused = false)}
    role="region"
    aria-label="Featured carousel"
  >
    <HomeHero entry={active} />

    {#if safeEntries.length > 1}
      <ol class="home-carousel__dots" aria-label="Carousel slides">
        {#each safeEntries as entry, i (entry.key)}
          <li>
            <button
              type="button"
              class="home-carousel__dot"
              data-active={i === index ? 'true' : undefined}
              aria-label={entry.title}
              aria-current={i === index ? 'true' : undefined}
              onclick={() => (index = i)}
            ></button>
          </li>
        {/each}
      </ol>
    {/if}
  </div>
{/if}

<style lang="scss">
  .home-carousel {
    position: relative;

    &__dots {
      position: absolute;
      bottom: clamp(12px, 1.5vw, 24px);
      right: clamp(12px, 2vw, 32px);
      z-index: 3;
      list-style: none;
      margin: 0;
      padding: 0;
      display: flex;
      gap: 8px;
    }

    &__dot {
      all: unset;
      cursor: pointer;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: color-mix(in srgb, var(--shade-10) 30%, transparent);
      transition: background 140ms ease, transform 140ms ease;

      &:hover {
        background: color-mix(in srgb, var(--shade-10) 60%, transparent);
      }

      &[data-active='true'] {
        background: var(--color-watched);
        transform: scale(1.15);
      }
    }
  }
</style>
