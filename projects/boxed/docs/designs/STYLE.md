# Artboard style guide ("Night screening")

Every artboard is a self-contained `.dc.html` file. Copy this skeleton exactly
(keep the `<script src="./support.js"></script>` line EXACTLY). Root element size
must equal the board's w/h and `$preview`. Desktop boards: 1440 wide (height as
needed, usually 1800-2600). Mobile boards: 390 wide (height as needed, 1600-2400).
Over-tall beats clipped. No fake iOS status bars.

```html
<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Film page - desktop</title>
<script src="./support.js"></script>
</head>
<body>
<x-dc>
<helmet>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Newsreader:opsz,wght@6..72,500;6..72,600;6..72,700&family=Roboto:wght@400;500;700&family=Roboto+Mono:wght@500&display=swap" rel="stylesheet">
<style>
body{margin:0;background:#141318;font-family:Roboto,"Helvetica Neue",Arial,sans-serif;color:#f6f5f8}
a{color:#c9a3e8;text-decoration:none}a:hover{color:#e4cdf6}
button{font:inherit;cursor:pointer}
</style>
</helmet>
<div style="width:1440px;height:2200px;box-sizing:border-box;background:#141318;...">
  ...
</div>
</x-dc>
<script type="text/x-dc" data-dc-script data-props='{"$preview":{"width":1440,"height":2200}}'>
class Component extends DCLogic {
  renderVals() { return {}; }
}
</script>
</body>
</html>
```

## Format rules that fail silently
- Close every non-void element, quote every attribute.
- Put layout styles INLINE (`style="..."`). `<helmet><style>` only for body/a/button basics (and small shared classes if truly needed).
- Flex/grid with `gap` for every sibling group. Grids: `display:grid;grid-template-columns:repeat(N, minmax(0, 1fr));gap:..`.
- `{{hole}}` is a plain dotted lookup into renderVals only. `<sc-for list="{{items}}" as="item" hint-placeholder-count="6">` for repeats (great for poster grids: define arrays in renderVals). `<sc-if value="{{flag}}" hint-placeholder-val="{{ true }}">`.
- Class script must exist, classic JS, `class Component extends DCLogic`. No imports.
- NO emoji anywhere. Icons = inline stroke SVG (24x24 viewBox, stroke="currentColor", stroke-width 1.8, fill none) sized 16-24px.
- Real `<button>`, `<a href="#">`, `<input>` with `<label>`. `aria-label` on icon-only buttons.
- No images, no network except the Google Fonts link. Posters are placeholders (below).
- `data-props` single-quoted JSON. No tweaks needed beyond `$preview`.

## Tokens (hex approximations of the Trakt oklch palette)
| Role | Hex |
|---|---|
| page bg (shade-950) | #141318 |
| deep bg / footer (shade-930 darker) | #0f0e13 |
| raised card (shade-930) | #1d1c22 |
| card 2 / input bg (shade-900) | #26252b |
| hairline (shade-800) | #37353d |
| hairline strong (shade-700) | #4a4851 |
| text primary (shade-10) | #f6f5f8 |
| text secondary (shade-300) | #a19fa8 |
| text tertiary (shade-500) | #77757d |
| brand purple (purple-500) | #9b2ad0 |
| purple hover / light text on dark | #c9a3e8 |
| purple deep tint bg | #2a1737 |
| star orange | #f59e2e |
| watched green | #3cc36a |
| watchlist blue | #4ea3e6 |
| like red | #f0506e |
| VIP chip | #9b2ad0 bg, white text, "VIP" |

Radii: posters 4px, cards 10px, pills 999px, buttons 8px.
Type:
- Titles of films/shows/episodes, big numbers, page hero headings: `font-family:Newsreader,Georgia,serif;font-weight:600` (sizes 28-56px, letter-spacing -0.01em).
- UI: Roboto 13-16px. Section labels: 12px, weight 500, uppercase, letter-spacing .08em, color #a19fa8, with a 1px #37353d rule under the row (label left, "More" link right).
- Codes like S02E04, runtimes, dates in tables: `font-family:"Roboto Mono",monospace;font-size:12px`.

## Components (draw them consistently)

**Top bar (desktop)** height 64, bg #141318 with bottom hairline, content max-width 1200 centered:
left: logo = a 28px rounded-square purple (#9b2ad0) mark with white bold "t" + wordmark "trakt" (Roboto 700, 20px) followed by thin "boxed" (Newsreader italic 20px, #c9a3e8).
middle nav links (uppercase 13px, letter-spacing .06em, #a19fa8, active #f6f5f8): FILMS SHOWS LISTS MEMBERS CALENDAR.
right: search input (220px, bg #26252b, radius 8, placeholder "Search films, shows, people"), a purple button "+ Log" (height 36), avatar circle 32px.
Signed-out variant: "Sign in" text link + "Create account" purple button instead of Log/avatar.

**Mobile top bar** 52px: logo mark + wordmark left, search icon + avatar right.
**Mobile bottom bar** 64px fixed at the bottom of the board, bg #1d1c22 top hairline: Home, Browse, center raised purple circle 52px with "+" (aria-label "Log"), Watching, Profile; icons + 10px labels.

**Poster placeholder**: a div with aspect-ratio 2/3 (or fixed w/h), radius 4, background = a solid muted tone (pick from #3b2f4a, #24394a, #4a2f2f, #2f4a3b, #4a432f, #2f3a4a, #3f2a3a, #2b4446, #463a2a, #333046), 1px inset hairline `box-shadow: inset 0 0 0 1px rgba(255,255,255,.08)`, and the title set small inside at the bottom-left in Newsreader 600 (white 85% opacity), sized relative to the poster (11-16px). This reads as a minimalist poster, not a gray box.
Poster states (draw on grids to show the system):
- watched: `box-shadow: 0 0 0 2px #3cc36a`
- watchlist: `box-shadow: 0 0 0 2px #4ea3e6`
- none: inset hairline only
- show in progress: add a 3px bar at the bottom inside the poster: track rgba(0,0,0,.5), fill #3cc36a at the % width.
- Under-poster meta when relevant: stars in orange (use the star glyph as inline SVG or the text "★" is NOT allowed? It IS allowed: "★" is a typographic character, not an emoji; use "★" and "½" in #f59e2e at 12px) + tiny heart icon in red if liked.

**Stars widget**: 5 stars 20-28px, orange filled / #4a4851 empty, supports half (draw half as a star with left half orange: use two overlapping spans or show "★★★★½"). Label above "Rated" or "Rate".

**Action card** (film/show/episode right rail, 300px wide, bg #26252b, radius 10, stacked rows separated by 1px #37353d):
row 1: three icon buttons with labels: Watched (eye; green when on), Like (heart; red when on), Watchlist (clock with +; blue when on).
row 2: "Rated" + stars.
rows: "Log or review again...", "Add to lists...", "Where to watch", "Share", "Your activity" as full-width text buttons centered, 14px, #d9d7de.

**Section header**: label left (12px uppercase .08em #a19fa8), link right ("More", "All"), hairline below, 16px gap to content.

**Review card**: avatar 32px + "Review by <strong>name</strong>" + orange stars + red heart if liked; small "Watched 12 Sep 2026" mono; body 15px/1.6 #d9d7de max 3 lines; footer: reaction chips (e.g. "Loved 214", "Laughed 12" - text only, pill #26252b) and "18 replies". Spoiler variant: body blurred-looking block (bg #26252b with text "This review may contain spoilers. Show anyway").

**Pills/chips**: height 28, radius 999, bg #26252b, 13px, #d9d7de. Active chip: bg #2a1737, text #e4cdf6, 1px #9b2ad0.
**Primary button**: bg #9b2ad0, white, 14px 500, height 40, radius 8, padding 0 18px. Secondary: bg #26252b, #f6f5f8, 1px #37353d.
**VIP upsell mini-card**: bg #2a1737, 1px #4b2463, radius 10, "VIP" chip + one line + "Unlock with VIP" link.

## Content rules
- Use REAL titles with real-sounding but fictional user data. Films: Dune: Part Two (2024, Denis Villeneuve), Past Lives, Perfect Days, Anatomy of a Fall, The Zone of Interest, Oppenheimer, Aftersun, Poor Things, Challengers, The Substance, Conclave, Anora, Sinners, One Battle After Another. Shows: Severance (Apple TV+, 2022-, Returning), The Bear, Shogun, Andor, The Pitt, Slow Horses, Succession (Ended), The Last of Us, Adolescence, Arcane. Users: ana_m, jonas, priya.k, theo, mira, lucas.
- For Severance use real episode titles: S2 = E1 Hello, Ms. Cobel; E2 Goodbye, Mrs. Selvig; E3 Who Is Alive?; E4 Woe's Hollow; E5 Trojan's Horse; E6 Attila; E7 Chikhai Bardo; E8 Sweet Vitriol; E9 The After Hours; E10 Cold Harbor. S1 has 9 episodes (Good News About Hell, Half Loop, In Perpetuity, The You You Are, The Grim Barbarity of Optics and Design, Hide and Seek, Defiant Jazz, What's for Dinner?, The We We Are).
- No lorem ipsum. Short real-feeling copy. Ratings like "3.9" average, counts like "412K".
- Every artboard shows the SIGNED-IN state unless it's the landing page.
- Use logical layout (it's a mockup, but prefer start/end thinking; no need for dir=rtl).
- Keep markup tidy; use sc-for with arrays in renderVals for repeated posters, rows, episodes.
