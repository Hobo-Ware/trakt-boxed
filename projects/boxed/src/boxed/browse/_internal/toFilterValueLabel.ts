import type { Filter } from '$lib/features/filters/models/Filter.ts';

type FilterValueLabelProps = {
  filter: Filter;
  value: string;
};

const EXCLUDED = '-';

function toOptionLabel(filter: Filter, token: string) {
  if (!('options' in filter)) return token;

  const isExcluded = token.startsWith(EXCLUDED);
  const raw = isExcluded ? token.slice(EXCLUDED.length) : token;
  const label =
    filter.options.find((option) => option.value === raw)?.label() ??
      raw;

  return isExcluded ? `${EXCLUDED}${label}` : label;
}

function toRangeLabel(filter: Filter, value: string) {
  if (filter.type !== 'slider') return null;

  const [min, max] = value.split('-').map(Number);
  if (min === undefined || max === undefined) return null;
  if (Number.isNaN(min) || Number.isNaN(max)) return null;

  const format = filter.ticks?.formatter ?? String;
  return `${format(min)}-${format(max)}`;
}

export function toFilterValueLabel({ filter, value }: FilterValueLabelProps) {
  const exact = 'options' in filter
    ? filter.options.find((option) => option.value === value)
    : undefined;
  if (exact) return exact.label();

  const range = toRangeLabel(filter, value);
  if (range) return range;

  return value
    .split(',')
    .map((token) => toOptionLabel(filter, token))
    .join(', ');
}
