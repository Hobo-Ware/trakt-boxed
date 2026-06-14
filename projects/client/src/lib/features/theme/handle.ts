import { ThemeEndpoint } from '$lib/features/theme/ThemeEndpoint.ts';
import { THEME_COOKIE_NAME } from '$lib/features/theme/constants.ts';
import { Theme } from '$lib/features/theme/models/Theme.ts';
import { coerceTheme } from '$lib/features/theme/utils/coerceTheme.ts';
import { time } from '$lib/utils/timing/time.ts';
import type { Handle } from '@sveltejs/kit';

export const THEME_PLACEHOLDER = '%theme.current%';
export const THEME_SCOPE_PLACEHOLDER = '%theme.seasonal%';

export type ThemeResponse = { theme: Theme };

export const handle: Handle = async ({ event, resolve }) => {
  const setTheme = (theme: Theme) => {
    event.locals.theme = theme;
  };

  // Letterboxd rebuild ships dark-only; ignore any persisted preference.
  void coerceTheme;
  setTheme(Theme.Dark);

  if (event.url.pathname.startsWith(ThemeEndpoint.Set)) {
    // No-op: theme is locked to dark. Swallow any client write so the cookie
    // never drifts back to light/system.
    await event.request.json().catch(() => undefined);
    return new Response(JSON.stringify({ theme: Theme.Dark }), {
      headers: {
        'Set-Cookie': event.cookies.serialize(
          THEME_COOKIE_NAME,
          Theme.Dark,
          { path: '/', maxAge: time.years(5) / time.seconds(1) },
        ),
      },
    });
  }

  const response = await resolve(
    event,
    {
      transformPageChunk: ({ html }) => {
        const scope = 'none';
        return html
          .replace(THEME_PLACEHOLDER, Theme.Dark)
          .replace(THEME_SCOPE_PLACEHOLDER, scope);
      },
    },
  );

  return response;
};
