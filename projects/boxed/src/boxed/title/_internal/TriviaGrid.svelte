<script lang="ts">
  import Skeleton from "$lib/components/skeleton/Skeleton.svelte";

  const { facts }: { facts: ReadonlyArray<string> | null } = $props();

  const SLOTS = 3;

  const toOrdinal = (index: number) => String(index + 1).padStart(2, "0");
</script>

<ol class="boxed-trivia-grid">
  {#if facts}
    {#each facts as fact, index (index)}
      <li class="boxed-trivia-card">
        <span class="boxed-trivia-number" aria-hidden="true">{toOrdinal(index)}</span>
        <p>{fact}</p>
      </li>
    {/each}
  {:else}
    {#each { length: SLOTS }, index (index)}
      <li class="boxed-trivia-card" aria-hidden="true">
        <Skeleton width="var(--ni-28)" height="var(--ni-22)" />
        <Skeleton height="var(--ni-72)" />
      </li>
    {/each}
  {/if}
</ol>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .boxed-trivia-grid {
    --trivia-line: calc(var(--ni-14) * 1.5);

    margin: 0;
    padding: 0;
    list-style: none;

    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: var(--ni-16);

    @include for-tablet-lg-and-below {
      display: flex;
      gap: var(--ni-12);
      overflow-x: auto;
      scroll-snap-type: inline mandatory;
      scrollbar-width: none;
    }
  }

  .boxed-trivia-card {
    box-sizing: border-box;
    height: calc(var(--ni-22) + var(--ni-8) + 4 * var(--trivia-line) + 2 * var(--ni-16));
    padding: var(--ni-16);

    display: flex;
    flex-direction: column;
    gap: var(--ni-8);

    border-radius: var(--border-radius-m);
    background: var(--color-card-background);
    box-shadow: inset 0 0 0 var(--border-thickness-xxs)
      color-mix(in srgb, var(--color-foreground) 6%, transparent);

    p {
      margin: 0;

      display: -webkit-box;
      -webkit-line-clamp: 4;
      line-clamp: 4;
      -webkit-box-orient: vertical;
      overflow: hidden;

      font-size: var(--ni-14);
      line-height: var(--trivia-line);
      color: var(--color-text-primary);
    }

    @include for-tablet-lg-and-below {
      flex: 0 0 var(--ni-252);
      scroll-snap-align: start;
    }
  }

  .boxed-trivia-number {
    font-family: var(--boxed-font-title);
    font-weight: 600;
    font-size: var(--ni-22);
    line-height: 1;
    color: var(--color-text-emphasis);
  }
</style>
