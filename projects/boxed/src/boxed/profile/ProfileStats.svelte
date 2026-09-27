<script lang="ts">
  import { languageTag } from "$lib/features/i18n";
  import { toHumanCount } from "$lib/utils/formatting/number/toHumanCount.ts";
  import type { ProfileStat } from "./_internal/toProfileStats.ts";

  const {
    stats,
    variant = "row",
  }: {
    stats: ReadonlyArray<ProfileStat>;
    variant?: "row" | "compact";
  } = $props();

  const toValue = (value: number | null | undefined) => {
    if (value === undefined) return "";
    return value === null ? "–" : toHumanCount(value, languageTag());
  };
</script>

<dl class="boxed-profile-stats" data-variant={variant}>
  {#each stats as stat (stat.key)}
    <div class="boxed-profile-stat">
      <dt>{stat.label}</dt>
      <dd>{toValue(stat.value)}</dd>
    </div>
  {/each}
</dl>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .boxed-profile-stats {
    margin: 0;
    display: grid;
    grid-auto-flow: column;
    grid-auto-columns: minmax(0, 1fr);

    &[data-variant="row"] {
      padding-block: var(--ni-16);
      border-block: var(--border-thickness-xxs) solid var(--color-border);

      @include for-mobile {
        grid-auto-flow: row;
        grid-template-columns: repeat(4, minmax(0, 1fr));
        gap: var(--gap-xs);
        padding-block: 0;
        border: none;

        .boxed-profile-stat {
          padding-block: var(--ni-10);
          border-radius: var(--border-radius-m);
          background: var(--color-card-background);
        }
      }
    }

    &[data-variant="compact"] {
      grid-auto-columns: var(--ni-80);
      gap: var(--ni-8);

      dd {
        font-size: var(--ni-22);
      }

      dt {
        font-size: var(--ni-10);
      }
    }
  }

  .boxed-profile-stat {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--ni-2);
    min-width: 0;
  }

  dd {
    margin: 0;
    width: 100%;
    height: 1.2em;
    text-align: center;
    font-family: var(--boxed-font-title);
    font-size: var(--ni-32);
    font-weight: 600;
    line-height: 1.2;
    font-variant-numeric: tabular-nums;

    @include for-mobile {
      font-size: var(--ni-22);
    }
  }

  dt {
    font-size: var(--ni-11);
    font-weight: 500;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    white-space: nowrap;
    color: var(--color-text-secondary);
  }
</style>
