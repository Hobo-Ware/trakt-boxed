import { useUser } from '$lib/features/auth/stores/useUser.ts';
import { combineLatest, map, of } from 'rxjs';
import type { FavoritesLookup } from './isEntryLiked.ts';
import type { RatingsLookup } from './toEntryRating.ts';

type DiaryUserState = {
  ratings: RatingsLookup | null;
  favorites: FavoritesLookup | null;
};

export function useDiaryUserState(isOwner: boolean) {
  const { ratings, favorites } = useUser();

  if (!isOwner) {
    return {
      userState: of<DiaryUserState>({ ratings: null, favorites: null }),
    };
  }

  return {
    userState: combineLatest([ratings, favorites]).pipe(
      map(([$ratings, $favorites]): DiaryUserState => ({
        ratings: $ratings ?? null,
        favorites: $favorites ?? null,
      })),
    ),
  };
}
