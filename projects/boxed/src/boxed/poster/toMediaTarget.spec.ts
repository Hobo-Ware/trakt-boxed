import { describe, expect, it } from 'vitest';
import { toMediaTarget } from './toMediaTarget.ts';

describe('util: toMediaTarget', () => {
  it('should tag a movie as a movie target', () => {
    const media = { type: 'movie', id: 1 };
    expect(toMediaTarget(media)).toEqual({ type: 'movie', media });
  });

  it('should tag anything else as a show target', () => {
    const media = { type: 'show', id: 2 };
    expect(toMediaTarget(media)).toEqual({ type: 'show', media });
  });
});
