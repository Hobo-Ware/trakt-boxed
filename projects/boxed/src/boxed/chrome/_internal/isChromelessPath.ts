const CHROMELESS_PATHS = new Set(['/', '/welcome']);

export function isChromelessPath(pathname: string): boolean {
  return CHROMELESS_PATHS.has(pathname.replace(/\/+$/, '') || '/');
}
