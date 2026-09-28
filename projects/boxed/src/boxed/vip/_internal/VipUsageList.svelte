<script lang="ts">
  import Skeleton from "$lib/components/skeleton/Skeleton.svelte";
  import { languageTag } from "$lib/features/i18n";
  import type { UsageCategory } from "$lib/sections/vip/utils/mapToUsageCategories.ts";
  import { clamp } from "$lib/utils/number/clamp.ts";
  import { ratio } from "$lib/utils/number/ratio.ts";
  import { toHumanCount } from "$lib/utils/formatting/number/toHumanCount.ts";

  type VipUsageListProps = {
    categories: ReadonlyArray<UsageCategory>;
    isLoading: boolean;
  };

  const { categories, isLoading }: VipUsageListProps = $props();

  const toFill = (current: number, limit: number) =>
    `${Math.round(clamp({ value: ratio({ value: current, total: limit }), min: 0, max: 1 }) * 100)}%`;
</script>

<div class="boxed-vip-usage">
  {#each categories as category (category.title)}
    <section class="boxed-vip-usage-group">
      <h3>{category.title()}</h3>
      <ul>
        {#each category.items as item (item.title)}
          <li>
            <span class="boxed-vip-usage-label">{item.title()}</span>
            <span class="boxed-vip-usage-count">
              {#if isLoading}
                <Skeleton width="var(--ni-64)" height="var(--ni-12)" />
              {:else}
                <strong>{toHumanCount(item.limits.current, languageTag())}</strong>
                / {toHumanCount(item.limits.vip, languageTag())}
              {/if}
            </span>
            <span
              class="boxed-vip-usage-bar"
              style:--fill={isLoading ? "0%" : toFill(item.limits.current, item.limits.vip)}
              aria-hidden="true"
            ></span>
          </li>
        {/each}
      </ul>
    </section>
  {/each}
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .boxed-vip-usage {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: var(--ni-16);

    @include for-tablet-sm-and-below {
      grid-template-columns: minmax(0, 1fr);
    }
  }

  .boxed-vip-usage-group {
    box-sizing: border-box;
    min-width: 0;
    padding: var(--ni-20);

    border-radius: var(--border-radius-m);
    background: var(--color-card-background);
    box-shadow: inset 0 0 0 var(--border-thickness-xxs)
      color-mix(in srgb, var(--color-foreground) 6%, transparent);

    h3 {
      margin: 0 0 var(--ni-8);
      font-size: var(--ni-12);
      font-weight: 600;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: var(--color-text-secondary);
    }

    ul {
      margin: 0;
      padding: 0;
      list-style: none;
    }

    li {
      padding-block: var(--ni-10);

      display: grid;
      grid-template-columns: minmax(0, 1fr) auto;
      row-gap: var(--ni-6);
      column-gap: var(--ni-8);
      align-items: center;
    }
  }

  .boxed-vip-usage-label {
    font-size: var(--ni-14);
    color: var(--color-text-primary);
  }

  .boxed-vip-usage-count {
    min-width: var(--ni-64);

    display: flex;
    justify-content: flex-end;
    gap: var(--ni-4);

    font-family: var(--boxed-font-mono);
    font-size: var(--ni-12);
    font-variant-numeric: tabular-nums;
    color: var(--color-text-secondary);

    strong {
      font-weight: 600;
      color: var(--color-text-primary);
    }
  }

  .boxed-vip-usage-bar {
    grid-column: 1 / -1;
    position: relative;
    height: var(--ni-4);

    border-radius: var(--border-radius-xxl);
    background: var(--color-input-background);
    overflow: hidden;

    &::after {
      content: "";
      position: absolute;
      inset-block: 0;
      inset-inline-start: 0;
      width: var(--fill);
      background: var(--boxed-color-accent-fill);
    }
  }
</style>
