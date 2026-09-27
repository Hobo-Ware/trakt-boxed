import { describe, expect, it } from 'vitest';
import { toEpisodeTypeLabel } from './toEpisodeTypeLabel.ts';

describe('util: toEpisodeTypeLabel', () => {
  it('should label premieres and finales', () => {
    expect(toEpisodeTypeLabel('season_premiere')).toBe('Season Premiere');
    expect(toEpisodeTypeLabel('series_finale')).toBe('Series Finale');
  });

  it('should return null for regular episodes', () => {
    expect(toEpisodeTypeLabel('standard')).toBeNull();
    expect(toEpisodeTypeLabel('unknown')).toBeNull();
  });
});
