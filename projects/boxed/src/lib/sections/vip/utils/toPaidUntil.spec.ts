import { describe, expect, it } from 'vitest';
import { toPaidUntil } from './toPaidUntil.ts';

describe('util: toPaidUntil', () => {
  it('should return the paid through date when it is past the renewal day', () => {
    const expiresAt = new Date(2027, 5, 1);

    expect(toPaidUntil({ renewsAt: new Date(2027, 3, 28), expiresAt }))
      .toBe(expiresAt);
  });

  it('should return null when paid through the renewal day or unknown', () => {
    expect(
      toPaidUntil({
        renewsAt: new Date(2027, 3, 28, 9),
        expiresAt: new Date(2027, 3, 28, 18),
      }),
    ).toBeNull();
    expect(toPaidUntil({ renewsAt: null, expiresAt: new Date() })).toBeNull();
  });
});
