import type { Filter } from '$lib/features/filters/models/Filter.ts';
import { FilterKey } from '$lib/features/filters/models/Filter.ts';
import { describe, expect, it } from 'vitest';
import { toFilterValueLabel } from './toFilterValueLabel.ts';

const genres: Filter = {
  key: FilterKey.Genres,
  type: 'list',
  label: () => 'Genre',
  options: [
    { label: () => 'Drama', value: 'drama' },
    { label: () => 'Horror', value: 'horror' },
  ],
  advanced: { type: 'multi-select' },
};

const ratings: Filter = {
  key: FilterKey.Ratings,
  type: 'slider',
  range: { min: 0, max: 100 },
  formatLabel: () => '',
  ticks: { count: 6, formatter: (value) => `${value}%` },
  advanced: {
    type: 'slider',
    range: { min: 0, max: 100 },
    formatLabel: () => '',
  },
};

describe('util: toFilterValueLabel', () => {
  it('should use the label of a matching option', () => {
    expect(toFilterValueLabel({ filter: genres, value: 'drama' })).toBe(
      'Drama',
    );
  });

  it('should join the labels of a multi value', () => {
    expect(toFilterValueLabel({ filter: genres, value: 'drama,-horror' }))
      .toBe('Drama, -Horror');
  });

  it('should fall back to the raw token for unknown options', () => {
    expect(toFilterValueLabel({ filter: genres, value: 'anime' })).toBe(
      'anime',
    );
  });

  it('should format a slider range with the tick formatter', () => {
    expect(toFilterValueLabel({ filter: ratings, value: '60-100' })).toBe(
      '60%-100%',
    );
  });
});
