import { invalidationId } from '$lib/requests/models/InvalidateAction.ts';
import { describe, expect, it } from 'vitest';
import { findInvalidationId } from './findInvalidationId.ts';

describe('findInvalidationId', () => {
  it('should return undefined when no invalidation id is present', () => {
    const result = findInvalidationId(['test', 123, { key: 'value' }]);
    expect(result).toBeUndefined();
  });

  it('should find invalidation id in query key array', () => {
    const id = invalidationId('test');
    const result = findInvalidationId(['someKey', id, 123]);
    expect(result).toBe(id);
  });

  it('should return undefined for empty array', () => {
    const result = findInvalidationId([]);
    expect(result).toBeUndefined();
  });

  it('should find invalidation id when it is the only element', () => {
    const id = invalidationId('single');
    const result = findInvalidationId([id]);
    expect(result).toBe(id);
  });
});
