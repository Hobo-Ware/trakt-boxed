import { describe, expect, it } from 'vitest';
import { toAmbientColors } from './toAmbientColors.ts';

describe('util: toAmbientColors', () => {
  it('should use the first poster colour for both glow and accent when it reads on the page', () => {
    expect(toAmbientColors(['#C7792C', '#F2D3A4'])).toEqual({
      glow: '#c7792c',
      accent: '#c7792c',
    });
  });

  it('should keep a dark first colour as the glow and take the accent from the second', () => {
    expect(toAmbientColors(['#2B4446', '#CFE3DC'])).toEqual({
      glow: '#2b4446',
      accent: '#cfe3dc',
    });
  });

  it('should fall back to the accent for the glow when the first colour disappears into the page', () => {
    expect(toAmbientColors(['#16151A', '#8FB8E6'])).toEqual({
      glow: '#8fb8e6',
      accent: '#8fb8e6',
    });
  });

  it('should return null when no colour reaches 3:1 against the page', () => {
    expect(toAmbientColors(['#1C130C', '#2A1F18'])).toBeNull();
  });

  it('should return null for missing or unparsable colours', () => {
    expect(toAmbientColors(undefined)).toBeNull();
    expect(toAmbientColors([])).toBeNull();
    expect(toAmbientColors(['transparent', 'not-a-colour'])).toBeNull();
  });
});
