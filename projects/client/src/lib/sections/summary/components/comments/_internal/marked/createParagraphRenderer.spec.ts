import type { RendererThis, Token, Tokens } from 'marked';
import { describe, expect, it } from 'vitest';
import { createParagraphRenderer } from './createParagraphRenderer.ts';

describe('createParagraphRenderer', () => {
  const mockParser = {
    parser: {
      parseInline: (tokens: Token[]) => {
        return tokens.map((t) => {
          if (t.type === 'text') return t.raw;
          if (t.type === 'em') return `<em>${t.text}</em>`;
          return t.raw;
        }).join('');
      },
    },
  } as unknown as RendererThis;

  it('renders a plain paragraph', () => {
    const renderer = createParagraphRenderer();
    const result = renderer.call(mockParser, {
      raw: 'plain paragraph',
      type: 'paragraph',
      text: 'plain paragraph',
      tokens: [{ type: 'text', raw: 'plain paragraph' }],
    });
    expect(result).to.equal('<p>plain paragraph</p>');
  });

  it('renders markdown formatting like italic', () => {
    const renderer = createParagraphRenderer();
    const paragraphToken: Tokens.Paragraph = {
      raw: 'text with *italic* formatting',
      type: 'paragraph',
      text: 'text with italic formatting',
      tokens: [
        { type: 'text', raw: 'text with ' },
        { type: 'em', text: 'italic', raw: '*italic*' },
        { type: 'text', raw: ' formatting' },
      ],
    };

    const result = renderer.call(mockParser, paragraphToken);
    expect(result).to.equal('<p>text with <em>italic</em> formatting</p>');
  });
});
