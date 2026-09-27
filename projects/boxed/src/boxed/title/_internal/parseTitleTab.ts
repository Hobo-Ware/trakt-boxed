type ParseTitleTabProps<T extends string> = {
  value: string | Nil;
  tabs: ReadonlyArray<T>;
};

export function parseTitleTab<T extends string>(
  { value, tabs }: ParseTitleTabProps<T>,
): T | undefined {
  const normalized = value?.trim().toLowerCase();

  return tabs.find((tab) => tab === normalized) ?? tabs.at(0);
}
