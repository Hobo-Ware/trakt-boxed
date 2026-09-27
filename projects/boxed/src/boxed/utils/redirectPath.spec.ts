import { describe, expect, it } from 'vitest';
import { redirectPath } from './redirectPath.ts';

describe('util: redirectPath', () => {
  it('should return the bare path when there are no params', () => {
    expect(redirectPath({ path: '/profile/me', search: new URLSearchParams() }))
      .toBe('/profile/me');
  });

  it('should keep the incoming params', () => {
    expect(
      redirectPath({
        path: '/people/ana',
        search: new URLSearchParams('movies=directing'),
      }),
    ).toBe('/people/ana?movies=directing');
  });

  it('should set params over the incoming ones', () => {
    expect(
      redirectPath({
        path: '/profile/me/lists',
        search: new URLSearchParams('tab=smart&mode=movie'),
        set: { tab: 'liked' },
      }),
    ).toBe('/profile/me/lists?tab=liked&mode=movie');
  });

  it('should drop the listed params', () => {
    expect(
      redirectPath({
        path: '/profile/me/diary',
        search: new URLSearchParams('page=2&mode=show'),
        drop: ['page'],
      }),
    ).toBe('/profile/me/diary?mode=show');
  });
});
