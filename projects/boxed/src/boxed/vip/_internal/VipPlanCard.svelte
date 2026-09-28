<script lang="ts">
  import * as m from "$lib/features/i18n/messages.ts";
  import type { VipPlan } from "$lib/sections/vip/models/VipPlan.ts";
  import { toPlanCopy } from "./toPlanCopy.ts";

  type VipPlanCardProps = {
    plan: VipPlan;
    isBusy: boolean;
    onCheckout: (plan: VipPlan) => void;
  };

  const { plan, isBusy, onCheckout }: VipPlanCardProps = $props();

  const copy = $derived(toPlanCopy(plan));
</script>

<article class="boxed-vip-plan" class:is-featured={plan.isPopular}>
  <header class="boxed-vip-plan-head">
    <h3>{copy.name}</h3>
    {#if copy.badge}
      <span class="boxed-vip-plan-badge">{copy.badge}</span>
    {/if}
  </header>

  <p class="boxed-vip-plan-price">
    <strong>{copy.price}</strong>
    <span>{m.boxed_vip_per_month()}</span>
  </p>
  <p class="boxed-vip-plan-billed">{copy.billed}</p>

  <button
    type="button"
    class="boxed-vip-plan-action"
    disabled={isBusy}
    onclick={() => onCheckout(plan)}
  >
    {copy.action}
  </button>
</article>

<style lang="scss">
  .boxed-vip-plan {
    box-sizing: border-box;
    min-width: 0;
    padding: var(--ni-24);

    display: flex;
    flex-direction: column;
    gap: var(--ni-8);

    border-radius: var(--border-radius-m);
    background: var(--color-card-background);
    box-shadow: inset 0 0 0 var(--border-thickness-xxs)
      color-mix(in srgb, var(--color-foreground) 6%, transparent);

    &.is-featured {
      box-shadow: inset 0 0 0 var(--border-thickness-xs)
        var(--boxed-color-accent-fill);
    }
  }

  .boxed-vip-plan-head {
    min-height: var(--ni-24);

    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--ni-8);

    h3 {
      margin: 0;
      font-size: var(--ni-12);
      font-weight: 600;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: var(--color-text-secondary);
    }
  }

  .boxed-vip-plan-badge {
    padding: var(--ni-2) var(--ni-8);

    border-radius: var(--border-radius-xxl);
    background: var(--boxed-color-accent-soft);
    color: var(--boxed-color-accent-text);

    font-size: var(--ni-11);
    font-weight: 600;
    white-space: nowrap;
  }

  .boxed-vip-plan-price {
    margin: var(--ni-8) 0 0;

    display: flex;
    align-items: baseline;
    gap: var(--ni-6);

    strong {
      font-family: var(--boxed-font-title);
      font-size: var(--ni-40);
      font-weight: 600;
      line-height: 1;
      color: var(--color-text-primary);
    }

    span {
      font-size: var(--ni-14);
      color: var(--color-text-secondary);
    }
  }

  .boxed-vip-plan-billed {
    flex: 1;
    margin: 0 0 var(--ni-12);
    font-size: var(--ni-14);
    line-height: 1.5;
    color: var(--color-text-secondary);
  }

  .boxed-vip-plan-action {
    height: var(--ni-44);
    padding-inline: var(--ni-18);

    border: none;
    border-radius: var(--border-radius-m);
    background: var(--purple-500);
    color: var(--shade-10);

    font: inherit;
    font-size: var(--ni-14);
    font-weight: 600;
    cursor: pointer;

    &:disabled {
      opacity: 0.5;
      cursor: default;
    }

    &:focus-visible {
      outline: var(--border-thickness-xs) solid var(--boxed-color-accent-text);
      outline-offset: var(--ni-2);
    }
  }
</style>
