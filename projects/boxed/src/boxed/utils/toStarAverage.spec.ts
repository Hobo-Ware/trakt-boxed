import { describe, expect, it } from 'vitest';
import { toStarAverage } from './toStarAverage.ts';

describe('util: toStarAverage', () => {
  it('should turn a 0 to 1 community rating into a five star score', () => {
    expect(toStarAverage(0.82, 'en')).toBe('4.1');
    expect(toStarAverage(1, 'en')).toBe('5.0');
  });
});
