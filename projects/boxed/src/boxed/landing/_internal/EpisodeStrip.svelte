<script lang="ts">
  import * as m from "$lib/features/i18n/messages.ts";
  import Stars from "../../components/Stars.svelte";

  const EPISODES = 10;
  const WATCHED = 6;
  const RATINGS: ReadonlyArray<number> = [8, 9, 7, 10, 9, 8];
</script>

<div class="boxed-episode-strip" aria-hidden="true">
  <div class="boxed-episode-strip-header">
    <span class="boxed-episode-strip-season">{m.text_season_number({ number: 1 })}</span>
    <span class="boxed-episode-strip-next">{m.boxed_log_up_next()} · {WATCHED + 1}</span>
  </div>
  <ol class="boxed-episode-strip-chips">
    {#each { length: EPISODES }, index (index)}
      <li
        class:is-watched={index < WATCHED}
        class:is-next={index === WATCHED}
      >
        {index + 1}
      </li>
    {/each}
  </ol>
  <ul class="boxed-episode-strip-ratings">
    {#each RATINGS as rating, index (index)}
      <li>
        <span class="boxed-episode-strip-code">{index + 1}</span>
        <Stars {rating} />
      </li>
    {/each}
  </ul>
</div>

<style>
  .boxed-episode-strip {
    padding: var(--ni-20);
    display: flex;
    flex-direction: column;
    gap: var(--ni-16);
    border-radius: var(--border-radius-l);
    background: var(--color-card-background);
    box-shadow: inset 0 0 0 var(--border-thickness-xxs) var(--color-border);
  }

  .boxed-episode-strip-header {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: var(--ni-12);
  }

  .boxed-episode-strip-season {
    font-family: var(--boxed-font-title);
    font-size: var(--ni-20);
    font-weight: 600;
  }

  .boxed-episode-strip-next {
    font-size: var(--ni-12);
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--boxed-color-accent-text);
  }

  .boxed-episode-strip-chips {
    margin: 0;
    padding: 0;
    list-style: none;
    display: grid;
    grid-template-columns: repeat(5, minmax(0, 1fr));
    gap: var(--ni-8);

    li {
      height: var(--ni-40);
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: var(--border-radius-m);
      background: var(--color-input-background);
      box-shadow: inset 0 0 0 var(--border-thickness-xxs) var(--color-border);
      font-family: "Roboto Mono", monospace;
      font-size: var(--ni-14);
      color: var(--color-text-secondary);
    }

    .is-watched {
      box-shadow: inset 0 0 0 var(--border-thickness-xs) var(--boxed-color-watched);
      color: var(--color-text-primary);
    }

    .is-next {
      background: var(--boxed-color-accent-soft);
      box-shadow: inset 0 0 0 var(--border-thickness-xs) var(--purple-500);
      color: var(--boxed-color-accent-text);
      font-weight: 700;
    }
  }

  .boxed-episode-strip-ratings {
    margin: 0;
    padding: 0;
    list-style: none;
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: var(--ni-8) var(--ni-20);

    li {
      display: flex;
      align-items: center;
      gap: var(--ni-10);
    }
  }

  .boxed-episode-strip-code {
    min-width: 2ch;
    font-family: "Roboto Mono", monospace;
    font-size: var(--ni-12);
    color: var(--color-text-secondary);
  }
</style>
