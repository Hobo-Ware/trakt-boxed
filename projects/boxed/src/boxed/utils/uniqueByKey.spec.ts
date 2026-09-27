import { describe, expect, it } from 'vitest';
import { uniqueByKey } from './uniqueByKey.ts';

describe('util: uniqueByKey', () => {
  it('should keep the first item of each key in order', () => {
    const items = [
      { key: 'a', page: 1 },
      { key: 'b', page: 1 },
      { key: 'a', page: 2 },
      { key: 'c', page: 2 },
    ];

    expect(uniqueByKey(items, (item) => item.key)).toEqual([
      { key: 'a', page: 1 },
      { key: 'b', page: 1 },
      { key: 'c', page: 2 },
    ]);
  });

  it('should return an empty list for no items', () => {
    expect(uniqueByKey([], (item: { key: string }) => item.key)).toEqual([]);
  });
});
