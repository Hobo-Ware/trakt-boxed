import type { AvailableLanguage } from '$lib/features/i18n/index.ts';
import * as m from '$lib/features/i18n/messages.ts';
import type { VipSubscription } from '$lib/requests/models/VipSubscription.ts';
import { toPaidUntil } from '$lib/sections/vip/utils/toPaidUntil.ts';
import { toPaymentMethodLabel } from '$lib/sections/vip/utils/toPaymentMethodLabel.ts';
import { toVipDurationLabel } from '$lib/sections/vip/utils/toVipDurationLabel.ts';
import { toHumanLongDate } from '$lib/utils/formatting/date/toHumanLongDate.ts';

type MembershipFact = {
  key: string;
  label: string;
  value: string;
};

const toRenewalFact = (
  subscription: VipSubscription,
  locale: AvailableLanguage,
): MembershipFact | null => {
  if (subscription.renewsAt) {
    return {
      key: 'renewal',
      label: m.header_renewal_date(),
      value: toHumanLongDate(subscription.renewsAt, locale),
    };
  }

  if (subscription.expiresAt) {
    return {
      key: 'expiration',
      label: m.header_expiration_date(),
      value: toHumanLongDate(subscription.expiresAt, locale),
    };
  }

  return null;
};

export function toMembershipFacts(
  subscription: VipSubscription,
  locale: AvailableLanguage,
): ReadonlyArray<MembershipFact> {
  const paidUntil = toPaidUntil(subscription);
  const plan = subscription.renewalPrice?.readable ??
    toVipDurationLabel(subscription.type);

  const facts: ReadonlyArray<MembershipFact | null> = [
    paidUntil
      ? {
        key: 'paid-until',
        label: m.header_paid_until(),
        value: toHumanLongDate(paidUntil, locale),
      }
      : null,
    toRenewalFact(subscription, locale),
    plan ? { key: 'plan', label: m.header_current_plan(), value: plan } : null,
    {
      key: 'payment',
      label: m.header_payment_method(),
      value: toPaymentMethodLabel(subscription.gateway),
    },
  ];

  return facts.filter((fact): fact is MembershipFact => fact !== null);
}
