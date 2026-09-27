import type {
  MediaCredit,
  MediaCredits,
} from '$lib/requests/models/MediaCredits.ts';
import { describe, expect, it } from 'vitest';
import { toRoleOrder } from './toRoleOrder.ts';

const creditsOf = (count: number) =>
  Array.from({ length: count }, () => ({}) as MediaCredit);

const credits: MediaCredits = new Map([
  ['self', creditsOf(32)],
  ['acting', creditsOf(3)],
  ['directing', creditsOf(19)],
  ['production', creditsOf(21)],
  ['sound', creditsOf(0)],
]);

describe('util: toRoleOrder', () => {
  it('should put the known for role first, then by count, self last', () => {
    expect(toRoleOrder(credits, 'directing').map((role) => role.position))
      .toEqual(['directing', 'production', 'acting', 'self']);
  });

  it('should order by count when known for is missing', () => {
    expect(toRoleOrder(credits, null).map((role) => role.position))
      .toEqual(['production', 'directing', 'acting', 'self']);
  });

  it('should return nothing while credits are loading', () => {
    expect(toRoleOrder(undefined, 'acting')).toEqual([]);
  });
});
