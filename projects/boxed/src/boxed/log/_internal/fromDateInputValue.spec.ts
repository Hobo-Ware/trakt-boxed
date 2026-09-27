import { describe, expect, it } from 'vitest';
import { fromDateInputValue } from './fromDateInputValue.ts';

describe('util: date input values', () => {
  it('should parse back to local noon so time zones keep the day', () => {
    const parsed = fromDateInputValue('2026-09-03');
    expect(parsed?.getFullYear()).toBe(2026);
    expect(parsed?.getMonth()).toBe(8);
    expect(parsed?.getDate()).toBe(3);
    expect(parsed?.getHours()).toBe(12);
  });

  it('should reject partial or malformed input', () => {
    expect(fromDateInputValue('')).toBeNull();
    expect(fromDateInputValue('2026-9-3')).toBeNull();
  });
});
