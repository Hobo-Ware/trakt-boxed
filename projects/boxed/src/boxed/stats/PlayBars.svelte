<script lang="ts">
  import * as m from "$lib/features/i18n/messages.ts";
  import type { PlayBar } from "./_internal/toPlayBars.ts";

  const { bars }: { bars: ReadonlyArray<PlayBar> | null } = $props();

  const max = $derived(
    Math.max(1, ...(bars ?? []).map((bar) => bar.movies + bar.episodes)),
  );
  const first = $derived(bars?.at(0)?.label ?? "");
  const last = $derived(bars?.at(-1)?.label ?? "");
</script>

<div class="boxed-play-bars">
  <div class="play-bars-chart" class:is-loading={bars === null}>
    {#if bars && bars.length === 0}
      <p class="play-bars-empty">{m.boxed_profile_empty()}</p>
    {:else if bars}
      {#each bars as bar (bar.key)}
        <span
          class="play-bar"
          title={`${bar.label}: ${bar.movies} ${m.yir_unit_movies()}, ${bar.episodes} ${m.yir_unit_episodes()}`}
        >
          <span
            class="play-bar-movies"
            style:height={`${(bar.movies / max) * 100}%`}
          ></span>
          <span
            class="play-bar-episodes"
            style:height={`${(bar.episodes / max) * 100}%`}
          ></span>
        </span>
      {/each}
    {/if}
  </div>
  <div class="play-bars-axis">
    <span>{first}</span>
    <span>{last}</span>
  </div>
</div>

<style>
  .boxed-play-bars {
    display: flex;
    flex-direction: column;
    gap: var(--ni-8);
  }

  .play-bars-chart {
    display: flex;
    align-items: flex-end;
    gap: var(--ni-3);
    height: var(--ni-152);
    border-bottom: var(--border-thickness-xxs) solid var(--color-border);

    &.is-loading {
      background: linear-gradient(
        0deg,
        var(--color-input-background),
        transparent
      );
      opacity: 0.6;
    }
  }

  .play-bar {
    flex: 1 1 0;
    min-width: 0;
    height: 100%;
    display: flex;
    flex-direction: column-reverse;
    gap: var(--ni-1);
  }

  .play-bar-movies,
  .play-bar-episodes {
    display: block;
    width: 100%;
  }

  .play-bar-movies {
    border-radius: var(--ni-3) var(--ni-3) 0 0;
    background: var(--boxed-color-accent-fill);
  }

  .play-bar-episodes {
    background: var(--boxed-color-accent-fill-alt);
  }

  .play-bars-empty {
    margin: auto;
    align-self: center;
    font-size: var(--ni-14);
    color: var(--color-text-secondary);
  }

  .play-bars-axis {
    display: flex;
    justify-content: space-between;
    min-height: var(--ni-16);
    font-size: var(--ni-12);
    color: var(--color-text-secondary);
  }
</style>
