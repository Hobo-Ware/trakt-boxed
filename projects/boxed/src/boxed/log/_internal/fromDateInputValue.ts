export function fromDateInputValue(value: string): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return null;

  const [, year, month, day] = match.map(Number);
  if (!year || !month || !day) return null;

  return new Date(year, month - 1, day, 12);
}
