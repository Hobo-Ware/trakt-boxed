import { clamp } from '$lib/utils/number/clamp.ts';

export function toStarGlyphs(rating: number): string {
  const stars = clamp({ value: rating, min: 0, max: 10 }) / 2;
  const full = Math.floor(stars);
  const hasHalf = stars - full >= 0.5;

  return '★'.repeat(full) + (hasHalf ? '½' : '');
}
