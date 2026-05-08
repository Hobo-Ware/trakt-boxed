import type { RendererThis, Tokens } from 'marked';

export function createParagraphRenderer() {
  return function (this: RendererThis, text: Tokens.Paragraph) {
    const parsedContent = this.parser.parseInline(text.tokens);
    return `<p>${parsedContent}</p>`;
  };
}
