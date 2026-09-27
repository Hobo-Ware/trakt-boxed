<script lang="ts">
  import Skeleton from "$lib/components/skeleton/Skeleton.svelte";
  import { languageTag } from "$lib/features/i18n";
  import { toHumanCount } from "$lib/utils/formatting/number/toHumanCount.ts";
  import type { StatsTotal } from "./_internal/toStatsTotals.ts";

  const TOTALS = 5;

  const { totals }: { totals: ReadonlyArray<StatsTotal> | null } = $props();
</script>

<dl class="boxed-stats-totals">
  {#if totals === null}
    {#each { length: TOTALS }, index (index)}
      <div aria-hidden="true">
        <dt><Skeleton width="var(--ni-64)" height="var(--ni-14)" /></dt>
        <dd><Skeleton width="var(--ni-96)" height="1em" /></dd>
      </div>
    {/each}
  {:else}
    {#each totals as total (total.key)}
      <div>
        <dt>{total.label}</dt>
        <dd>{toHumanCount(total.value, languageTag())}</dd>
      </div>
    {/each}
  {/if}
</dl>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .boxed-stats-totals {
    margin: 0;
    display: grid;
    grid-template-columns: repeat(5, minmax(0, 1fr));
    gap: var(--ni-16);
    padding-block: var(--ni-20);
    border-block: var(--border-thickness-xxs) solid var(--color-border);

    @include for-mobile {
      grid-template-columns: repeat(3, minmax(0, 1fr));
      row-gap: var(--ni-20);
    }

    div {
      display: flex;
      flex-direction: column-reverse;
      justify-content: flex-end;
      gap: var(--ni-4);
      min-width: 0;
    }

    dd {
      margin: 0;
      min-height: var(--ni-48);
      font-family: var(--boxed-font-title);
      font-size: var(--ni-48);
      font-weight: 600;
      line-height: 1;
      letter-spacing: -0.01em;

      @include for-mobile {
        min-height: var(--ni-32);
        font-size: var(--ni-32);
      }
    }

    dt {
      min-height: var(--ni-20);
      font-size: var(--ni-14);
      color: var(--color-text-secondary);
    }
  }
</style>
