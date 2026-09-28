import { VIP_PLANS } from '$lib/sections/vip/constants/index.ts';
import { describe, expect, it } from 'vitest';
import { toPlanCopy } from './toPlanCopy.ts';

const plan = (type: string) => {
  const found = VIP_PLANS.find((candidate) => candidate.type === type);
  if (!found) throw new Error(`missing ${type} plan`);
  return found;
};

describe('util: toPlanCopy', () => {
  it('should show the monthly price and how the plan is billed', () => {
    expect(toPlanCopy(plan('yearly'))).toMatchObject({
      name: 'Yearly',
      badge: 'Most popular',
      price: '$4.99',
    });
    expect(toPlanCopy(plan('yearly')).billed).toContain('$59.88');
  });

  it('should mark the two year plan as the best value', () => {
    expect(toPlanCopy(plan('two_years')).badge).not.toBeNull();
    expect(toPlanCopy(plan('monthly')).badge).toBeNull();
  });
});
