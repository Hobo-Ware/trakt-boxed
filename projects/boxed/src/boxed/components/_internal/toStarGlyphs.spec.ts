import { describe, expect, it } from 'vitest';
import { toStarGlyphs } from './toStarGlyphs.ts';

describe('util: toStarGlyphs', () => {
  it('should turn a 1-10 rating into full and half stars', () => {
    expect(toStarGlyphs(10)).toBe('★★★★★');
    expect(toStarGlyphs(9)).toBe('★★★★½');
    expect(toStarGlyphs(1)).toBe('½');
  });

  it('should clamp ratings outside 0-10', () => {
    expect(toStarGlyphs(14)).toBe('★★★★★');
    expect(toStarGlyphs(-2)).toBe('');
  });
});
