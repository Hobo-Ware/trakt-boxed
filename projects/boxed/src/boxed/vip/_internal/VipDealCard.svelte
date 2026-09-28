<script lang="ts">
  import * as m from "$lib/features/i18n/messages.ts";
  import type { VipDealPlan } from "$lib/sections/vip/models/VipDealPlan.ts";
  import type { VipPlan } from "$lib/sections/vip/models/VipPlan.ts";
  import { toVipPriceLabel } from "$lib/sections/vip/utils/toVipPriceLabel.ts";

  type VipDealCardProps = {
    plan: VipDealPlan;
    isPaypalSwitch: boolean;
    isBusy: boolean;
    onCheckout: (plan: VipPlan) => void;
  };

  const { plan, isPaypalSwitch, isBusy, onCheckout }: VipDealCardProps =
    $props();

  const price = $derived(toVipPriceLabel(plan.discount.discountedAmount));
  const renewalPrice = $derived(toVipPriceLabel(plan.totalPrice));

  const copy = $derived(
    isPaypalSwitch
      ? {
        eyebrow: m.tag_text_vip_deal_paypal_switch(),
        header: m.header_vip_deal_paypal_switch({ price }),
        description: m.text_vip_deal_paypal_switch({ price, renewalPrice }),
      }
      : {
        eyebrow: m.tag_text_vip_deal_welcome_back(),
        header: m.header_vip_deal_welcome_back({ price }),
        description: m.text_vip_deal_welcome_back({ price, renewalPrice }),
      },
  );
</script>

<section class="boxed-vip-deal">
  <div class="boxed-vip-deal-copy">
    <p class="boxed-vip-deal-eyebrow">{copy.eyebrow}</p>
    <h2>{copy.header}</h2>
    <p class="boxed-vip-deal-description">{copy.description}</p>
  </div>

  <div class="boxed-vip-deal-offer">
    <strong>{price}</strong>
    <span>{m.text_vip_deal_term()}</span>
    <button
      type="button"
      aria-label={m.button_label_vip_claim_deal()}
      disabled={isBusy}
      onclick={() => onCheckout(plan)}
    >
      {m.button_text_vip_claim_deal()}
    </button>
  </div>
</section>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .boxed-vip-deal {
    box-sizing: border-box;
    padding: var(--ni-24) var(--ni-28);

    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    align-items: center;
    gap: var(--ni-32);

    border-radius: var(--border-radius-m);
    background: var(--boxed-color-accent-soft);
    box-shadow: inset 0 0 0 var(--border-thickness-xs)
      var(--boxed-color-accent-fill);

    @include for-mobile {
      grid-template-columns: minmax(0, 1fr);
      gap: var(--ni-20);
      padding: var(--ni-20);
    }
  }

  .boxed-vip-deal-copy {
    display: flex;
    flex-direction: column;
    gap: var(--ni-8);

    h2 {
      margin: 0;
      font-family: var(--boxed-font-title);
      font-size: var(--ni-28);
      font-weight: 600;
      line-height: 1.2;
    }
  }

  .boxed-vip-deal-eyebrow {
    margin: 0;
    font-size: var(--ni-12);
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--boxed-color-accent-text);
  }

  .boxed-vip-deal-description {
    margin: 0;
    font-size: var(--ni-14);
    line-height: 1.5;
    color: var(--color-text-secondary);
  }

  .boxed-vip-deal-offer {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: var(--ni-6);

    strong {
      font-family: var(--boxed-font-title);
      font-size: var(--ni-40);
      font-weight: 600;
      line-height: 1;
    }

    span {
      font-size: var(--ni-14);
      color: var(--color-text-secondary);
    }

    button {
      height: var(--ni-44);
      margin-top: var(--ni-8);
      padding-inline: var(--ni-20);

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
    }
  }
</style>
