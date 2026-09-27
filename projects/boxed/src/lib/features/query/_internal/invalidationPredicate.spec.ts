import { describe, expect, it } from 'vitest';
import { invalidationPredicate } from './invalidationPredicate.ts';

describe('invalidationPredicate', () => {
  it('should return true when queryKey includes the id', () => {
    const queryKey = ['test', '123', 'other'];
    const id = '123';
    expect(invalidationPredicate(queryKey, id)).toBe(true);
  });

  it('should return false when queryKey does not include the id', () => {
    const queryKey = ['test', '123', 'other'];
    const id = '456';
    expect(invalidationPredicate(queryKey, id)).toBe(false);
  });

  it('should work with empty queryKey', () => {
    const queryKey: string[] = [];
    const id = '123';
    expect(invalidationPredicate(queryKey, id)).toBe(false);
  });

  it('should work with different types in queryKey', () => {
    const queryKey = ['test', 123, true, { id: '456' }];
    const id = '456';
    expect(invalidationPredicate(queryKey, id)).toBe(false);
  });
});
