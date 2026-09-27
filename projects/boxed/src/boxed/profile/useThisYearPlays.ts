import { useUser } from '$lib/features/auth/stores/useUser.ts';
import { map } from 'rxjs';
import { countPlaysInYear } from './_internal/countPlaysInYear.ts';

export function useThisYearPlays() {
  const { history } = useUser();
  const year = new Date().getFullYear();

  return {
    thisYear: history.pipe(
      map(($history) => {
        if (!$history) return null;

        const dates = [
          ...[...$history.movies.values()].flatMap((movie) =>
            movie.watchedDates
          ),
          ...[...$history.shows.values()].flatMap((show) => show.watchedDates),
        ];

        return countPlaysInYear({ dates, year });
      }),
    ),
  };
}
