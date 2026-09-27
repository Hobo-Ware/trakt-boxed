import { describe, expect, it } from 'vitest';
import { toTimeAgo } from './toTimeAgo.ts';

describe('util: toTimeAgo', () => {
  const now = new Date('2026-09-26T21:00:00Z');

  it('should pick the largest unit', () => {
    expect(toTimeAgo(now, new Date('2026-09-26T19:00:00Z'), 'en'))
      .toBe('2 hours ago');
    expect(toTimeAgo(now, new Date('2026-09-26T20:45:00Z'), 'en'))
      .toBe('15 minutes ago');
    expect(toTimeAgo(now, new Date('2026-09-25T21:00:00Z'), 'en'))
      .toBe('yesterday');
  });

  it('should use latin digits for arabic, like the other date helpers', () => {
    expect(toTimeAgo(now, new Date('2026-09-26T18:00:00Z'), 'ar-SA'))
      .toContain('3');
  });
});
