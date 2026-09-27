import type { Filter } from '$lib/features/filters/models/Filter.ts';

type WithFilterValueProps = {
  url: URL;
  filter: Filter;
  value: string | null;
};

function linkedKeys(filter: Filter): ReadonlyArray<string> {
  if (!('advanced' in filter)) return [];
  if (!('additionalKeys' in filter.advanced)) return [];

  return (filter.advanced.additionalKeys ?? []).map(({ key }) => key);
}

export function withFilterValue(
  { url, filter, value }: WithFilterValueProps,
): URL {
  const next = new URL(url);

  if (value) {
    next.searchParams.set(filter.key, value);
    return next;
  }

  [filter.key, ...linkedKeys(filter)].forEach((key) =>
    next.searchParams.delete(key)
  );
  return next;
}
