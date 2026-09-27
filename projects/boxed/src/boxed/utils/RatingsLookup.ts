type RatingMap = ReadonlyMap<number, { rating: number }>;

export type RatingsLookup = {
  movies: RatingMap;
  shows: RatingMap;
  episodes: RatingMap;
};
