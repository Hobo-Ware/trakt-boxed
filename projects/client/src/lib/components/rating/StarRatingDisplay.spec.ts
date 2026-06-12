import { render, screen } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';
import StarRatingDisplay from './StarRatingDisplay.svelte';

describe('StarRatingDisplay', () => {
  it('should render only full stars for an even rating', () => {
    render(StarRatingDisplay, { props: { rating: 8 } });

    const rects = screen.getByRole('img').querySelectorAll('svg rect');

    expect(rects).toHaveLength(4);
    rects.forEach((rect) => expect(rect.getAttribute('width')).toBe('100%'));
  });

  it('should render a trailing half star for an odd rating', () => {
    render(StarRatingDisplay, { props: { rating: 7 } });

    const rects = screen.getByRole('img').querySelectorAll('svg rect');

    expect(rects).toHaveLength(4);
    expect(rects[3]?.getAttribute('width')).toBe('50%');
  });

  it('should render a single half star for the lowest rating', () => {
    render(StarRatingDisplay, { props: { rating: 1 } });

    const rects = screen.getByRole('img').querySelectorAll('svg rect');

    expect(rects).toHaveLength(1);
    expect(rects[0]?.getAttribute('width')).toBe('50%');
  });

  it('should label the rating out of 5 stars', () => {
    render(StarRatingDisplay, { props: { rating: 7 } });

    expect(
      screen.getByRole('img', { name: 'Rated 3.5 out of 5 stars.' }),
    ).toBeDefined();
  });
});
