<script lang="ts">
  import PageContainer from "$boxed/components/PageContainer.svelte";
  import SectionHeader from "$boxed/components/SectionHeader.svelte";
  import Skeleton from "$lib/components/skeleton/Skeleton.svelte";
  import { useUser } from "$lib/features/auth/stores/useUser.ts";
  import { languageTag } from "$lib/features/i18n";
  import * as m from "$lib/features/i18n/messages.ts";
  import ProfileImage from "$lib/sections/profile-banner/ProfileImage.svelte";
  import LifetimeBadge from "$lib/sections/vip/LifetimeBadge.svelte";
  import PaymentHistory from "$lib/sections/vip/PaymentHistory.svelte";
  import SubscriptionActions from "$lib/sections/vip/SubscriptionActions.svelte";
  import { useVip } from "$lib/sections/vip/useVip.ts";
  import { mapToUsageCategories } from "$lib/sections/vip/utils/mapToUsageCategories.ts";
  import { toHumanLongDate } from "$lib/utils/formatting/date/toHumanLongDate.ts";
  import { toDisplayableName } from "$lib/utils/profile/toDisplayableName.ts";
  import VipFeatureList from "./_internal/VipFeatureList.svelte";
  import VipPaypalSwitch from "./_internal/VipPaypalSwitch.svelte";
  import VipUsageList from "./_internal/VipUsageList.svelte";
  import { toMembershipFacts } from "./_internal/toMembershipFacts.ts";

  const SKELETON_FACTS = 3;
  const SKELETON_HISTORY = 3;

  const { user, limits } = useUser();
  const { subscription, isLoading } = useVip();

  const isLifetime = $derived($subscription?.type === "life");
  const hasPlanDetails = $derived(!isLifetime && !$user.isDirector);
  const facts = $derived(
    $subscription ? toMembershipFacts($subscription, languageTag()) : [],
  );
  const categories = $derived(mapToUsageCategories($limits));
  const transactions = $derived($subscription?.transactions ?? []);
</script>

<PageContainer>
  <header class="boxed-vip-member">
    <ProfileImage
      --image-size="var(--ni-72)"
      --border-width="var(--border-thickness-xs)"
      name={$user.name.first}
      src={$user.avatar.url}
      isVip={$user.isVip}
    />
    <div class="boxed-vip-member-copy">
      <p class="boxed-vip-member-eyebrow">{m.tag_text_vip()}</p>
      <h1>{toDisplayableName($user)}</h1>
      <p class="boxed-vip-member-since">
        {#if $subscription?.memberSince}
          {m.text_member_since({
            date: toHumanLongDate($subscription.memberSince, languageTag()),
          })}
        {/if}
        {#if isLifetime}<LifetimeBadge />{/if}
      </p>
    </div>
    {#if hasPlanDetails && !$isLoading}
      <div class="boxed-vip-member-actions">
        <SubscriptionActions subscription={$subscription} />
      </div>
    {/if}
  </header>

  {#if hasPlanDetails}
    <dl class="boxed-vip-facts" aria-busy={$isLoading}>
      {#if $isLoading}
        {#each { length: SKELETON_FACTS }, index (index)}
          <div class="boxed-vip-fact" aria-hidden="true">
            <dt><Skeleton width="var(--ni-96)" height="var(--ni-12)" /></dt>
            <dd><Skeleton width="var(--ni-144)" height="var(--ni-22)" /></dd>
          </div>
        {/each}
      {:else}
        {#each facts as fact (fact.key)}
          <div class="boxed-vip-fact">
            <dt>{fact.label}</dt>
            <dd>{fact.value}</dd>
          </div>
        {/each}
      {/if}
    </dl>
  {/if}

  <section class="boxed-vip-section">
    <SectionHeader title={m.button_text_usage()} />
    <VipUsageList {categories} isLoading={!$limits} />
  </section>

  {#if $isLoading}
    <section class="boxed-vip-section" aria-hidden="true">
      <SectionHeader title={m.button_text_history()} />
      <div class="boxed-vip-history-skeleton">
        {#each { length: SKELETON_HISTORY }, index (index)}
          <Skeleton height="var(--ni-36)" />
        {/each}
      </div>
    </section>
  {:else if transactions.length > 0}
    <section class="boxed-vip-section">
      <SectionHeader title={m.button_text_history()} />
      <PaymentHistory {transactions} />
    </section>
  {/if}

  <VipPaypalSwitch subscription={$subscription} />

  <section class="boxed-vip-section">
    <SectionHeader title={m.boxed_vip_features_title()} />
    <VipFeatureList />
  </section>
</PageContainer>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .boxed-vip-member {
    display: flex;
    align-items: center;
    gap: var(--ni-20);

    @include for-mobile {
      gap: var(--ni-14);
    }
  }

  .boxed-vip-member-copy {
    flex: 1;
    min-width: 0;

    display: flex;
    flex-direction: column;
    gap: var(--ni-6);

    h1 {
      @include boxed-page-title;
    }
  }

  .boxed-vip-member-eyebrow {
    margin: 0;
    font-size: var(--ni-12);
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--boxed-color-accent-text);
  }

  .boxed-vip-member-since {
    min-height: var(--ni-20);
    margin: 0;

    display: flex;
    align-items: center;
    gap: var(--ni-8);

    font-size: var(--ni-14);
    color: var(--color-text-secondary);
  }

  .boxed-vip-member-actions {
    align-self: flex-start;
  }

  .boxed-vip-facts {
    margin: 0;

    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(var(--ni-200), 1fr));
    gap: var(--ni-16);
  }

  .boxed-vip-fact {
    box-sizing: border-box;
    padding: var(--ni-18) var(--ni-20);

    display: flex;
    flex-direction: column;
    gap: var(--ni-6);

    border-radius: var(--border-radius-m);
    background: var(--color-card-background);
    box-shadow: inset 0 0 0 var(--border-thickness-xxs)
      color-mix(in srgb, var(--color-foreground) 6%, transparent);

    dt {
      min-height: var(--ni-16);
      font-size: var(--ni-12);
      font-weight: 600;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: var(--color-text-secondary);
    }

    dd {
      min-height: var(--ni-28);
      margin: 0;
      font-family: var(--boxed-font-title);
      font-size: var(--ni-22);
      font-weight: 600;
      color: var(--color-text-primary);
    }
  }

  .boxed-vip-history-skeleton {
    display: flex;
    flex-direction: column;
    gap: var(--gap-m);
  }

  .boxed-vip-section {
    display: flex;
    flex-direction: column;
    gap: var(--ni-12);
  }
</style>
