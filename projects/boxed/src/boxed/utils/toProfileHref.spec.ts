import { describe, expect, it } from 'vitest';
import { toProfileHref } from './toProfileHref.ts';

describe('util: toProfileHref', () => {
  it('should link to the slug', () => {
    expect(toProfileHref({ slug: 'sean', username: 'Sean' }))
      .toBe('/profile/sean');
  });

  it('should fall back to the username without a slug', () => {
    expect(toProfileHref({ slug: null, username: 'justin' }))
      .toBe('/profile/justin');
  });
});
