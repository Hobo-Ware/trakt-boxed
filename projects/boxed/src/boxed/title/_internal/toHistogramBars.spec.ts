import { describe, expect, it } from 'vitest';
import { toHistogramBars } from './toHistogramBars.ts';

describe('util: toHistogramBars', () => {
  it('should scale each rating against the most common one', () => {
    const bars = toHistogramBars({ '1': 5, '8': 20, '10': 10 });

    expect(bars).toHaveLength(10);
    expect(bars.at(0)).toEqual({
      rating: 1,
      count: 5,
      ratio: 0.25,
      isPeak: false,
    });
    expect(bars.at(7)).toEqual({
      rating: 8,
      count: 20,
      ratio: 1,
      isPeak: true,
    });
    expect(bars.at(9)?.ratio).toBe(0.5);
  });

  it('should return ten empty bars when there is no distribution', () => {
    const bars = toHistogramBars(undefined);

    expect(bars).toHaveLength(10);
    expect(bars.every((bar) => bar.ratio === 0 && !bar.isPeak)).toBe(true);
  });
});
