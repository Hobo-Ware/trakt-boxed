import { describe, expect, it } from 'vitest';
import { isChromelessPath } from './isChromelessPath.ts';

describe('util: isChromelessPath', () => {
  it('should hide the chrome on the landing and onboarding pages', () => {
    expect(isChromelessPath('/')).toBe(true);
    expect(isChromelessPath('/welcome')).toBe(true);
    expect(isChromelessPath('/welcome/')).toBe(true);
  });

  it('should keep the chrome everywhere else', () => {
    expect(isChromelessPath('/home')).toBe(false);
    expect(isChromelessPath('/welcome-back')).toBe(false);
    expect(isChromelessPath('/movies/dune')).toBe(false);
  });
});
