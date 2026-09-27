import { describe, expect, it } from 'vitest';
import { isDrawerNavigation } from './isDrawerNavigation.ts';

const url = (path: string) => new URL(path, 'http://localhost');

describe('util: isDrawerNavigation', () => {
  it('should detect opening a drawer on the same page', () => {
    expect(
      isDrawerNavigation({
        from: url('/movies/dune'),
        to: url('/movies/dune?view=videos'),
      }),
    ).toBe(true);
  });

  it('should detect closing a drawer', () => {
    expect(
      isDrawerNavigation({
        from: url('/shows/severance?view=cast&season=1'),
        to: url('/shows/severance?season=1'),
      }),
    ).toBe(true);
  });

  it('should detect switching drawer params while a drawer is open', () => {
    expect(
      isDrawerNavigation({
        from: url('/shows/severance?view=comments'),
        to: url('/shows/severance?view=comments&comment=12'),
      }),
    ).toBe(true);
  });

  it('should ignore navigation to another page', () => {
    expect(
      isDrawerNavigation({
        from: url('/movies/dune'),
        to: url('/movies/arrival?view=videos'),
      }),
    ).toBe(false);
  });

  it('should ignore same page navigation without a drawer', () => {
    expect(
      isDrawerNavigation({
        from: url('/profile/me'),
        to: url('/profile/me?tab=lists'),
      }),
    ).toBe(false);
  });

  it('should ignore other origins', () => {
    expect(
      isDrawerNavigation({
        from: url('/movies/dune'),
        to: new URL('https://example.com/movies/dune?view=videos'),
      }),
    ).toBe(false);
  });
});
