export function toStarGlyphs(rating: number): string {
  const stars = Math.max(0, Math.min(rating, 10)) / 2;
  const full = Math.floor(stars);
  const hasHalf = stars - full >= 0.5;

  return '★'.repeat(full) + (hasHalf ? '½' : '');
}
