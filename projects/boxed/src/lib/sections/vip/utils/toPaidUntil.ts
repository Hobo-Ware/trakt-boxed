import type { VipSubscription } from '$lib/requests/models/VipSubscription.ts';
import { getStartOfDay } from '$lib/utils/date/getStartOfDay.ts';

export function toPaidUntil(
  subscription: Pick<VipSubscription, 'renewsAt' | 'expiresAt'>,
): Date | null {
  if (!subscription.renewsAt || !subscription.expiresAt) return null;

  const paidThroughDay = getStartOfDay(subscription.expiresAt);
  const renewalDay = getStartOfDay(subscription.renewsAt);

  return paidThroughDay.getTime() > renewalDay.getTime()
    ? subscription.expiresAt
    : null;
}
