<script lang="ts">
  import PageContainer from "$boxed/components/PageContainer.svelte";
  import SectionHeader from "$boxed/components/SectionHeader.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import { VIP_PLANS } from "$lib/sections/vip/constants/index.ts";
  import type { VipPlan } from "$lib/sections/vip/models/VipPlan.ts";
  import { useVip } from "$lib/sections/vip/useVip.ts";
  import { findTwoYearDealPlan } from "$lib/sections/vip/utils/findTwoYearDealPlan.ts";
  import { isPaypalGateway } from "$lib/sections/vip/utils/isPaypalGateway.ts";
  import VipDealCard from "./_internal/VipDealCard.svelte";
  import VipFeatureList from "./_internal/VipFeatureList.svelte";
  import VipLimitsTable from "./_internal/VipLimitsTable.svelte";
  import VipPlanCard from "./_internal/VipPlanCard.svelte";

  const COSTS = [
    m.text_vip_costs_metadata,
    m.text_vip_costs_infrastructure,
    m.text_vip_costs_clients,
    m.text_vip_costs_team,
  ] as const;

  const { plans, startCheckout, isFetching, subscription } = useVip();

  const activePlans = $derived($plans.length > 0 ? $plans : VIP_PLANS);
  const dealPlan = $derived(findTwoYearDealPlan(activePlans));
  const isPaypalSwitch = $derived(
    isPaypalGateway($subscription?.gateway) && !$subscription?.isCancelled,
  );

  const checkout = async (plan: VipPlan) => {
    if ($isFetching) return;

    const url = await startCheckout(plan);
    if (url) globalThis.window.location.href = url;
  };
</script>

<PageContainer>
  <header class="boxed-vip-header">
    <p class="boxed-vip-eyebrow">{m.tag_text_vip()}</p>
    <h1>{m.boxed_vip_title()}</h1>
    <p class="boxed-vip-lede">
      {m.text_vip_get_insights()}
      {m.tag_text_vip()}
      {m.text_vip_powers_trakt()}
    </p>
  </header>

  {#if dealPlan}
    <VipDealCard
      plan={dealPlan}
      {isPaypalSwitch}
      isBusy={$isFetching}
      onCheckout={checkout}
    />
  {/if}

  <section id="vip-plans" class="boxed-vip-section">
    <SectionHeader title={m.boxed_vip_plans_title()} />
    <div class="boxed-vip-plans">
      {#each activePlans as plan (plan.type)}
        <VipPlanCard {plan} isBusy={$isFetching} onCheckout={checkout} />
      {/each}
    </div>
  </section>

  <section class="boxed-vip-section">
    <SectionHeader title={m.boxed_vip_features_title()} />
    <p class="boxed-vip-tagline">{m.text_vip_features_tagline()}</p>
    <VipFeatureList />
  </section>

  <div class="boxed-vip-pair">
    <section class="boxed-vip-card">
      <h2>{m.vip_text_vip_go_beyond_limits()}</h2>
      <VipLimitsTable />
    </section>

    <section class="boxed-vip-card">
      <h2>{m.text_vip_built_to_last()}</h2>
      <p>{m.text_vip_costs()}</p>
      <ul>
        {#each COSTS as cost (cost)}
          <li>{cost()}</li>
        {/each}
      </ul>
    </section>
  </div>

  <section class="boxed-vip-closing">
    <h2>{m.text_vip_join_now_tagline()}</h2>
    <p>{m.text_vip_join_now()}</p>
    <a href="#vip-plans">{m.button_text_vip_compare_plans()}</a>
  </section>
</PageContainer>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .boxed-vip-header {
    max-width: var(--ni-768);

    display: flex;
    flex-direction: column;
    gap: var(--ni-12);

    h1 {
      @include boxed-page-title;
    }
  }

  .boxed-vip-eyebrow {
    margin: 0;
    font-size: var(--ni-12);
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--boxed-color-accent-text);
  }

  .boxed-vip-lede {
    margin: 0;
    font-size: var(--ni-16);
    line-height: 1.6;
    color: var(--color-text-secondary);
  }

  .boxed-vip-section {
    display: flex;
    flex-direction: column;
    gap: var(--ni-12);
    scroll-margin-top: calc(var(--boxed-header-height) + var(--ni-16));
  }

  .boxed-vip-plans {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: var(--ni-16);

    @include for-tablet-sm-and-below {
      grid-template-columns: minmax(0, 1fr);
    }
  }

  .boxed-vip-tagline {
    margin: 0;
    font-size: var(--ni-14);
    color: var(--color-text-secondary);
  }

  .boxed-vip-pair {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: var(--ni-16);

    @include for-tablet-sm-and-below {
      grid-template-columns: minmax(0, 1fr);
    }
  }

  .boxed-vip-card {
    box-sizing: border-box;
    min-width: 0;
    padding: var(--ni-24);

    display: flex;
    flex-direction: column;
    gap: var(--ni-12);

    border-radius: var(--border-radius-m);
    background: var(--color-card-background);
    box-shadow: inset 0 0 0 var(--border-thickness-xxs)
      color-mix(in srgb, var(--color-foreground) 6%, transparent);

    h2 {
      margin: 0 0 var(--ni-4);
      font-family: var(--boxed-font-title);
      font-size: var(--ni-24);
      font-weight: 600;
      line-height: 1.2;
    }

    p,
    ul {
      margin: 0;
      font-size: var(--ni-14);
      line-height: 1.6;
      color: var(--color-text-secondary);
    }

    ul {
      padding-inline-start: var(--ni-18);
    }
  }

  .boxed-vip-closing {
    padding: var(--ni-40) var(--ni-24);

    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--ni-12);

    border-top: var(--border-thickness-xxs) solid var(--color-border);
    text-align: center;

    h2 {
      margin: 0;
      max-width: var(--ni-640);
      font-family: var(--boxed-font-title);
      font-size: var(--ni-28);
      font-weight: 600;
      line-height: 1.2;
    }

    p {
      margin: 0;
      max-width: var(--ni-520);
      font-size: var(--ni-14);
      line-height: 1.6;
      color: var(--color-text-secondary);
    }

    a {
      height: var(--ni-44);
      margin-top: var(--ni-8);
      padding-inline: var(--ni-20);

      display: inline-flex;
      align-items: center;

      border-radius: var(--border-radius-m);
      background: var(--purple-500);
      color: var(--shade-10);

      font-size: var(--ni-14);
      font-weight: 600;
      text-decoration: none;
    }
  }
</style>
