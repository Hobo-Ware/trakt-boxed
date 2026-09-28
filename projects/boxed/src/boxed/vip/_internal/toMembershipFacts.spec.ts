import type { VipSubscription } from '$lib/requests/models/VipSubscription.ts';
import { describe, expect, it } from 'vitest';
import { toMembershipFacts } from './toMembershipFacts.ts';

const subscription = (
  overrides: Partial<VipSubscription>,
): VipSubscription => ({
  type: 'yearly',
  plan: 'vip_yearly',
  memberSince: new Date(2020, 3, 28),
  renewsAt: new Date(2027, 3, 28),
  expiresAt: new Date(2027, 3, 28),
  gateway: 'stripe',
  isCancelled: false,
  vipYears: 6,
  daysLeft: 214,
  renewalPrice: { usd: 59.88, readable: '$59.88' },
  manageUrl: null,
  transactions: [],
  ...overrides,
});

describe('util: toMembershipFacts', () => {
  it('should list renewal, plan and payment method', () => {
    const facts = toMembershipFacts(subscription({}), 'en');

    expect(facts.map((fact) => fact.key)).toEqual([
      'renewal',
      'plan',
      'payment',
    ]);
    expect(facts.at(1)?.value).toBe('$59.88');
  });

  it('should show the expiry date when the plan does not renew', () => {
    const facts = toMembershipFacts(
      subscription({ renewsAt: null, isCancelled: true }),
      'en',
    );

    expect(facts.at(0)?.key).toBe('expiration');
  });

  it('should add the paid until date when it runs past the renewal day', () => {
    const facts = toMembershipFacts(
      subscription({ expiresAt: new Date(2027, 6, 1) }),
      'en',
    );

    expect(facts.at(0)?.key).toBe('paid-until');
  });
});
