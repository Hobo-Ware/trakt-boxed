import { describe, expect, it } from 'vitest';
import { toReviewPreview } from './toReviewPreview.ts';

describe('util: toReviewPreview', () => {
  it('should mask inline spoilers', () => {
    expect(
      toReviewPreview('Great ending. [spoiler]Paul wins[/spoiler] Wow.', '…'),
    ).toBe('Great ending. … Wow.');
  });

  it('should strip markdown emphasis, headings and links', () => {
    expect(
      toReviewPreview(
        '# Title\n**bold** and [a link](https://x.y) `code`',
        '…',
      ),
    ).toBe('Title bold and a link code');
  });

  it('should collapse whitespace and line breaks', () => {
    expect(toReviewPreview('  one\n\n two   three ', '…')).toBe(
      'one two three',
    );
  });
});
