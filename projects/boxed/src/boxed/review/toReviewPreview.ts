const SPOILER_TAG = /\[spoiler\][\s\S]*?\[\/spoiler\]/gi;
const MARKDOWN_NOISE = /(\*\*|__|~~|`|^#+\s|^>\s?)/gm;
const MARKDOWN_LINK = /!?\[([^\]]*)\]\([^)]*\)/g;

export function toReviewPreview(comment: string, spoilerMask: string): string {
  return comment
    .replace(SPOILER_TAG, spoilerMask)
    .replace(MARKDOWN_LINK, '$1')
    .replace(MARKDOWN_NOISE, '')
    .replace(/\s+/g, ' ')
    .trim();
}
