import { describe, expect, it } from 'vitest';
import { toProfileChanges } from './toProfileChanges.ts';

const current = {
  name: 'Ana Marin',
  location: 'Lisbon',
  about: 'Slow cinema.',
};

describe('util: toProfileChanges', () => {
  it('should return nothing for an untouched draft', () => {
    expect(toProfileChanges({ draft: {}, current })).toEqual({});
  });

  it('should drop fields that match the current value', () => {
    expect(
      toProfileChanges({
        draft: { name: 'Ana Marin', location: 'Porto' },
        current,
      }),
    ).toEqual({ location: 'Porto' });
  });

  it('should trim values before comparing', () => {
    expect(
      toProfileChanges({
        draft: { name: '  Ana Marin ', about: ' Fast TV. ' },
        current,
      }),
    ).toEqual({ about: 'Fast TV.' });
  });

  it('should keep a field that was cleared', () => {
    expect(toProfileChanges({ draft: { location: '   ' }, current })).toEqual({
      location: '',
    });
  });
});
