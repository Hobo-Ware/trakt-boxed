import { describe, expect, it } from 'vitest';
import { toLeaderboardStat } from './toLeaderboardStat.ts';

describe('util: toLeaderboardStat', () => {
  it('should format hours and plays', () => {
    expect(
      toLeaderboardStat({
        entry: { totalMinutes: 8520, totalPlays: 1234, locked: false },
        locale: 'en',
      }),
    ).toBe('142 hours · 1.2K plays');
  });

  it('should skip a missing metric', () => {
    expect(
      toLeaderboardStat({
        entry: { totalMinutes: null, totalPlays: 12, locked: false },
        locale: 'en',
      }),
    ).toBe('12 plays');
  });

  it('should return null for locked or empty entries', () => {
    expect(
      toLeaderboardStat({
        entry: { totalMinutes: 600, totalPlays: 10, locked: true },
        locale: 'en',
      }),
    ).toBeNull();
    expect(
      toLeaderboardStat({
        entry: { totalMinutes: null, totalPlays: null, locked: false },
        locale: 'en',
      }),
    ).toBeNull();
  });
});
