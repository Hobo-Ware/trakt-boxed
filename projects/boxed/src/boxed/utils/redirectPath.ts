type RedirectPathProps = {
  path: string;
  search: URLSearchParams;
  set?: Readonly<Record<string, string>>;
  drop?: ReadonlyArray<string>;
};

export function redirectPath(
  { path, search, set = {}, drop = [] }: RedirectPathProps,
): string {
  const params = new URLSearchParams(search);
  drop.forEach((key) => params.delete(key));
  Object.entries(set).forEach(([key, value]) => params.set(key, value));

  const query = params.toString();
  return query ? `${path}?${query}` : path;
}
