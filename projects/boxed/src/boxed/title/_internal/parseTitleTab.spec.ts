import { describe, expect, it } from 'vitest';
import { parseTitleTab } from './parseTitleTab.ts';

const TABS = ['cast', 'crew', 'details', 'genres', 'releases'] as const;

describe('util: parseTitleTab', () => {
  it('should return the matching tab', () => {
    expect(parseTitleTab({ value: 'details', tabs: TABS })).toBe('details');
  });

  it('should ignore case and surrounding whitespace', () => {
    expect(parseTitleTab({ value: ' Crew ', tabs: TABS })).toBe('crew');
  });

  it('should fall back to the first tab for unknown or missing values', () => {
    expect(parseTitleTab({ value: 'trivia', tabs: TABS })).toBe('cast');
    expect(parseTitleTab({ value: null, tabs: TABS })).toBe('cast');
  });

  it('should return undefined when there are no tabs', () => {
    expect(parseTitleTab({ value: 'cast', tabs: [] })).toBeUndefined();
  });
});
