import { describe, expect, it } from 'vitest';
import { toSeasonHref } from './toSeasonHref.ts';

describe('util: toSeasonHref', () => {
  it('should build the season page path', () => {
    expect(toSeasonHref('severance', 2)).toBe('/shows/severance/seasons/2');
  });

  it('should support specials', () => {
    expect(toSeasonHref('severance', 0)).toBe('/shows/severance/seasons/0');
  });
});
