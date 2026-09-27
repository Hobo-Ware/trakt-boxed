import { describe, expect, it } from 'vitest';
import { toStreakLabel } from './toStreakLabel.ts';

describe('util: toStreakLabel', () => {
  it('should join the day count and the streak word', () => {
    expect(toStreakLabel(1)).toBe('1-day streak');
    expect(toStreakLabel(12)).toBe('12-day streak');
  });
});
