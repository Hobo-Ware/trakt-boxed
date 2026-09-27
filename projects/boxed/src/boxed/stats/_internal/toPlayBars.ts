import type {
  YirDetail,
  YirYearCount,
} from '$lib/requests/models/YirDetail.ts';
import type { YirYear } from '$lib/requests/models/YirYear.ts';

export type PlayBar = {
  key: string;
  label: string;
  movies: number;
  episodes: number;
};

function toYearlyBars(
  movies: ReadonlyArray<YirYearCount>,
  shows: ReadonlyArray<YirYearCount>,
): PlayBar[] {
  const years = [...new Set([...movies, ...shows].map(({ year }) => year))]
    .toSorted((a, b) => a - b);

  return years.map((year) => ({
    key: `${year}`,
    label: `${year}`,
    movies: movies.find((entry) => entry.year === year)?.count ?? 0,
    episodes: shows.find((entry) => entry.year === year)?.count ?? 0,
  }));
}

function toWeeklyBars(
  movies: ReadonlyArray<number>,
  shows: ReadonlyArray<number>,
): PlayBar[] {
  const length = Math.max(movies.length, shows.length);

  return Array.from({ length }, (_, index) => ({
    key: `${index}`,
    label: `${index + 1}`,
    movies: movies.at(index) ?? 0,
    episodes: shows.at(index) ?? 0,
  }));
}

export function toPlayBars(
  { detail, year }: { detail: YirDetail; year: YirYear },
): PlayBar[] {
  const movies = detail.stats.movies.distributions;
  const shows = detail.stats.shows.distributions;

  if (year === 'all') {
    return toYearlyBars(movies?.yearly ?? [], shows?.yearly ?? []);
  }

  return toWeeklyBars(movies?.weekly ?? [], shows?.weekly ?? []);
}
