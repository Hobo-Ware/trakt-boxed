---
trigger: glob
globs: "**"
description: "Infrastructure rules: trakt-boxed deployment shape, request endpoints, and CI invariants."
applyTo: "**"
---

# Infrastructure Guidelines

## Deployment

trakt-boxed ships as a single Cloudflare Worker via
`@sveltejs/adapter-cloudflare`. The worker name is `trakt-boxed` in
`projects/client/wrangler.jsonc`. CI deploys on every push to `main`.

- `cloudflare/wrangler-action@v3` runs with `wranglerVersion: "4.88.0"`
  pinned. Do not bump the wrangler version inside the workflow without
  also re-validating against `@sveltejs/adapter-cloudflare`'s peer
  range.
- Node 22 is required for Wrangler 4 + adapter-cloudflare 7. The CI
  step uses `actions/setup-node`.
- `projects/client/.npmrc` carries `legacy-peer-deps=true` and
  `@jsr:registry=https://npm.jsr.io`. The root `.npmrc` is not read
  from `projects/client/` because the deploy step `cd`s into that
  directory before installing — keep both files in sync.

## Request endpoints

Two flavours of Trakt API live in the codebase:

- `/v3/users/me/...` — me-only optimisations. The server short-circuits
  to the authenticated user, ignores any user slug in the path, and
  uses cached aggregations. Use these only when you genuinely mean
  "the current user". Never construct a `me` URL for an arbitrary
  slug — the response will silently belong to whoever is logged in.
- The typed `@trakt/api` contract — for arbitrary user slugs, list
  IDs, media slugs, and everything else. This is the path that
  exposes the typed schema and validates the response.

When a feature needs both — e.g. "show this user's diary if it's me,
otherwise their public diary" — branch on `useIsMe(slug)` and pick
the appropriate request. Don't paper over the difference with a
shared helper that conditionally swaps URLs; the response shapes are
not always identical.

## Cover hero crop

The `.summary-hero` pattern in `style/components.css` lays out the
page-level cinematic backdrop. X / LinkedIn crop the edges by
roughly 5–10% when sharing — the bottom and side fades on the hero
hug the centred 80% so subject framing survives. When authoring a
new cover image or OG asset, keep the actionable composition inside
the central 80% of the canvas.

## CI / pre-deploy gates

- `deno task i18n:check` from `projects/client/` reports drift
  between `en.json` and the other 20 locale files. Wire it into CI
  before deploy so a missing locale key cannot ship.
- The pre-existing date-fixture tests on `toRelativeHumanDay`,
  `AirDateTag`, and `MediaDetails` are stable — failing those is a
  regression, not a baseline.
