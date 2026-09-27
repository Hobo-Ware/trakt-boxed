import { describe, expect, it } from 'vitest';
import { siteSectionFor } from './siteSectionFor.ts';

describe('util: siteSectionFor', () => {
  it('should map title pages to their media section', () => {
    expect(siteSectionFor({ pathname: '/movies/dune', discoverMode: null }))
      .toBe('movies');
    expect(siteSectionFor({ pathname: '/shows/severance', discoverMode: null }))
      .toBe('shows');
  });

  it('should follow the discover mode on discover pages', () => {
    expect(siteSectionFor({ pathname: '/discover', discoverMode: 'movie' }))
      .toBe('movies');
    expect(
      siteSectionFor({ pathname: '/discover/trending', discoverMode: 'show' }),
    ).toBe('shows');
    expect(siteSectionFor({ pathname: '/discover', discoverMode: 'media' }))
      .toBeNull();
  });

  it('should map every list surface to lists', () => {
    expect(
      siteSectionFor({ pathname: '/lists/official/x', discoverMode: null }),
    )
      .toBe('lists');
    expect(siteSectionFor({ pathname: '/users/me/lists', discoverMode: null }))
      .toBe('lists');
    expect(
      siteSectionFor({ pathname: '/users/me/watchlist', discoverMode: null }),
    ).toBe('lists');
  });

  it('should map the members directory to members', () => {
    expect(siteSectionFor({ pathname: '/members', discoverMode: null }))
      .toBe('members');
  });

  it('should map the calendar and ignore everything else', () => {
    expect(siteSectionFor({ pathname: '/calendar', discoverMode: null }))
      .toBe('calendar');
    expect(siteSectionFor({ pathname: '/home', discoverMode: 'movie' }))
      .toBeNull();
    expect(siteSectionFor({ pathname: '/users/me/listsx', discoverMode: null }))
      .toBeNull();
  });
});
