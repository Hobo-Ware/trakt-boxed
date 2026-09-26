import { describe, expect, it } from 'vitest';
import { toPosterOutline } from './toPosterOutline.ts';

describe('util: toPosterOutline', () => {
  it('should prefer watched over watchlist', () => {
    expect(toPosterOutline({ isWatched: true, isWatchlisted: true }))
      .toBe('watched');
  });

  it('should mark watchlisted titles', () => {
    expect(toPosterOutline({ isWatched: false, isWatchlisted: true }))
      .toBe('watchlist');
  });

  it('should fall back to none', () => {
    expect(toPosterOutline({ isWatched: false, isWatchlisted: false }))
      .toBe('none');
  });
});
