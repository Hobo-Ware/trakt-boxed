export function countWords(text: string): number {
  return text.trim().split(/\s+/u).filter(Boolean).length;
}
