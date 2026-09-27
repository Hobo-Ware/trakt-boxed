export function countPlaysInYear(
  { dates, year }: { dates: ReadonlyArray<Date>; year: number },
): number {
  return dates.filter((date) => date.getFullYear() === year).length;
}
