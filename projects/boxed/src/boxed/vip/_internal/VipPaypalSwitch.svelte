<script lang="ts">
  import Button from "$lib/components/buttons/Button.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { VipSubscription } from "$lib/requests/models/VipSubscription.ts";
  import { useVip } from "$lib/sections/vip/useVip.ts";
  import { findTwoYearDealPlan } from "$lib/sections/vip/utils/findTwoYearDealPlan.ts";
  import { isPaypalGateway } from "$lib/sections/vip/utils/isPaypalGateway.ts";
  import { toVipPriceLabel } from "$lib/sections/vip/utils/toVipPriceLabel.ts";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder.ts";

  const { subscription }: { subscription: VipSubscription | null | undefined } =
    $props();

  const { plans } = useVip();

  const isPaypal = $derived(isPaypalGateway(subscription?.gateway));
  const dealPlan = $derived(findTwoYearDealPlan($plans));
</script>

{#if isPaypal}
  <section class="boxed-vip-paypal">
    <div class="boxed-vip-paypal-copy">
      <h2>{m.header_vip_paypal_switch()}</h2>
      <p>{m.text_vip_paypal_switch()}</p>
    </div>
    <div class="boxed-vip-paypal-action">
      {#if dealPlan}
        <p class="boxed-vip-paypal-price">
          <strong>{toVipPriceLabel(dealPlan.discount.discountedAmountMonthly)}</strong>
          <span>{m.boxed_vip_per_month()} · {m.text_vip_billed_biyearly()}</span>
        </p>
      {/if}
      <Button
        href={UrlBuilder.renewVip()}
        size="small"
        variant="primary"
        style="flat"
        color="purple"
        label={m.button_label_vip_paypal_switch()}
      >
        {m.button_text_vip_paypal_switch()}
      </Button>
    </div>
  </section>
{/if}

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .boxed-vip-paypal {
    box-sizing: border-box;
    padding: var(--ni-24);

    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    align-items: center;
    gap: var(--ni-24);

    border-radius: var(--border-radius-m);
    background: var(--boxed-color-accent-soft);
    box-shadow: inset 0 0 0 var(--border-thickness-xs)
      var(--boxed-color-accent-fill);

    @include for-mobile {
      grid-template-columns: minmax(0, 1fr);
      padding: var(--ni-20);
    }
  }

  .boxed-vip-paypal-copy {
    display: flex;
    flex-direction: column;
    gap: var(--ni-6);

    h2 {
      margin: 0;
      font-family: var(--boxed-font-title);
      font-size: var(--ni-24);
      font-weight: 600;
    }

    p {
      margin: 0;
      font-size: var(--ni-14);
      line-height: 1.5;
      color: var(--color-text-secondary);
    }
  }

  .boxed-vip-paypal-action {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: var(--ni-10);
  }

  .boxed-vip-paypal-price {
    margin: 0;

    display: flex;
    align-items: baseline;
    gap: var(--ni-6);

    strong {
      font-family: var(--boxed-font-title);
      font-size: var(--ni-28);
      font-weight: 600;
    }

    span {
      font-size: var(--ni-12);
      color: var(--color-text-secondary);
    }
  }
</style>
