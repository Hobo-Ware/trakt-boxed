export type ComposerKind = 'movie' | 'show' | 'episode';

export type ComposerTarget = {
  kind: ComposerKind;
  id: number;
  slug: string;
  title: string;
  year?: number | null;
  posterUrl?: string;
  effectiveReleaseDate: Date;
  season?: number;
  episode?: number;
};
