import type { Filter } from '$lib/features/filters/models/Filter.ts';

export type FilterChipProps = {
  filter: Filter;
  label: string;
  value: string | Nil;
  onChange: (value: string | null) => void;
  onOpenDrawer: () => void;
};
