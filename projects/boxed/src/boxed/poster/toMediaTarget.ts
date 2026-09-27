export type MediaTarget<T> =
  | { type: 'movie'; media: T }
  | { type: 'show'; media: T };

export function toMediaTarget<T extends { type: string }>(
  media: T,
): MediaTarget<T> {
  return media.type === 'movie'
    ? { type: 'movie', media }
    : { type: 'show', media };
}
