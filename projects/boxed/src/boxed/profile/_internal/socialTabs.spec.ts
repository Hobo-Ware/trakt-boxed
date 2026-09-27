import { describe, expect, it } from 'vitest';
import { parseLikesTab } from './parseLikesTab.ts';
import { parseNetworkTab } from './parseNetworkTab.ts';

describe('util: parseNetworkTab', () => {
  it('should default to following', () => {
    expect(parseNetworkTab({ value: null, isMe: true })).toBe('following');
  });

  it('should only allow requests for the owner', () => {
    expect(parseNetworkTab({ value: 'requests', isMe: true })).toBe(
      'requests',
    );
    expect(parseNetworkTab({ value: 'requests', isMe: false })).toBe(
      'following',
    );
  });
});

describe('util: parseLikesTab', () => {
  it('should fall back to the legacy mode param', () => {
    expect(parseLikesTab({ tab: null, mode: 'show', isMe: false })).toBe(
      'show',
    );
  });

  it('should prefer the tab param over mode', () => {
    expect(parseLikesTab({ tab: 'movie', mode: 'show', isMe: false })).toBe(
      'movie',
    );
  });

  it('should only allow liked lists for the owner', () => {
    expect(parseLikesTab({ tab: 'lists', mode: null, isMe: true })).toBe(
      'lists',
    );
    expect(parseLikesTab({ tab: 'lists', mode: null, isMe: false })).toBe(
      'movie',
    );
  });
});
