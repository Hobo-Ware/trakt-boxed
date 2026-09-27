import type { Filter } from '$lib/features/filters/models/Filter.ts';
import { FilterKey } from '$lib/features/filters/models/Filter.ts';
import { describe, expect, it } from 'vitest';
import { withFilterValue } from './withFilterValue.ts';

const genres: Filter = {
  key: FilterKey.Genres,
  type: 'list',
  label: () => 'Genre',
  options: [],
  advanced: { type: 'multi-select' },
};

const ratings: Filter = {
  key: FilterKey.Ratings,
  type: 'slider',
  range: { min: 0, max: 100 },
  formatLabel: () => '',
  advanced: {
    type: 'slider',
    range: { min: 0, max: 100 },
    formatLabel: () => '',
    additionalKeys: [{ key: FilterKey.ImdbRatings }],
  },
};

const base = 'https://trakt.tv/discover/popular?mode=movie';

describe('util: withFilterValue', () => {
  it('should set the filter value and keep other params', () => {
    const url = withFilterValue({
      url: new URL(base),
      filter: genres,
      value: 'drama',
    });

    expect(url.search).toBe('?mode=movie&genres=drama');
  });

  it('should remove the filter and its linked keys when cleared', () => {
    const url = withFilterValue({
      url: new URL(`${base}&ratings=60-100&imdb_ratings=6-10`),
      filter: ratings,
      value: null,
    });

    expect(url.search).toBe('?mode=movie');
  });

  it('should not mutate the given url', () => {
    const original = new URL(base);
    withFilterValue({ url: original, filter: genres, value: 'drama' });

    expect(original.search).toBe('?mode=movie');
  });
});
