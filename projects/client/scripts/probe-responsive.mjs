// Probe key Letterboxd pages at several viewport widths.
// Detects horizontal overflow and clipped elements so layout regressions
// surface visually (screenshots) and programmatically (logged warnings).
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';

const BASE = process.env.BASE ?? 'http://localhost:5173';
const OUT = './scripts/probe-out';

mkdirSync(OUT, { recursive: true });

// Pages to probe. Public-only — auth-gated pages will redirect or render
// their skeleton and that is fine for an overflow audit.
const ROUTES = [
  { path: '/', name: 'home' },
  { path: '/films', name: 'films' },
  { path: '/tv', name: 'tv' },
  { path: '/lists', name: 'lists' },
  { path: '/calendar', name: 'calendar' },
  { path: '/search', name: 'search' },
  { path: '/movies/heretic-2024', name: 'movie' },
  { path: '/shows/the-pitt', name: 'show' },
  { path: '/about', name: 'about' },
  { path: '/terms', name: 'terms' },
  { path: '/privacy', name: 'privacy' },
  { path: '/vip', name: 'vip' },
];

const WIDTHS = [375, 600, 768, 1024, 1280, 1600];

const browser = await chromium.launch();

const issues = [];

for (const width of WIDTHS) {
  const context = await browser.newContext({
    viewport: { width, height: 900 },
    deviceScaleFactor: 1,
  });
  // Pre-set the consent cookie (matches COOKIE_CONSENT_COOKIE_NAME) so the
  // dialog never paints over real content during probing.
  const consentValue = {
    categories: ['necessary', 'functionality', 'analytics'],
    revision: 4,
    data: {
      expiration: new Date(Date.now() + 1000 * 60 * 60 * 24 * 180).toUTCString(),
      saved: new Date().toUTCString(),
    },
    consentTimestamp: new Date().toISOString(),
    consentId: '00000000-0000-0000-0000-000000000000',
    services: { necessary: [], functionality: [], analytics: [], advertising: [] },
    lastConsentTimestamp: new Date().toISOString(),
    expirationTime: Date.now() + 1000 * 60 * 60 * 24 * 180,
  };
  await context.addCookies([
    {
      name: '_traktconsent',
      value: encodeURIComponent(JSON.stringify(consentValue)),
      domain: 'localhost',
      path: '/',
    },
  ]);
  const page = await context.newPage();
  for (const route of ROUTES) {
    const url = `${BASE}${route.path}`;
    try {
      await page.goto(url, { waitUntil: 'networkidle', timeout: 15000 });
    } catch {
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 15000 });
    }
    // Settle a moment for client paint / queries.
    await page.waitForTimeout(2500);

    // Dismiss cookie dialog if still present.
    const consent = page.locator('button:has-text("Functional only")');
    if (await consent.count()) {
      try {
        await consent.first().click({ timeout: 500 });
        await page.waitForTimeout(400);
      } catch {
        // ignore
      }
    }

    const metrics = await page.evaluate(() => {
      const html = document.documentElement;
      const body = document.body;
      return {
        scrollWidth: Math.max(html.scrollWidth, body.scrollWidth),
        clientWidth: html.clientWidth,
        hasHScroll: html.scrollWidth - html.clientWidth > 1,
      };
    });

    if (metrics.hasHScroll) {
      issues.push(
        `H-OVERFLOW @${width}px ${route.path}: scrollWidth=${metrics.scrollWidth} viewport=${metrics.clientWidth}`,
      );
    }

    await page.screenshot({
      path: `${OUT}/${width}-${route.name}.png`,
      fullPage: false,
    });
  }
  await context.close();
}

await browser.close();

if (issues.length === 0) {
  console.log('OK — no horizontal overflow on any probed route × width.');
} else {
  console.log('Issues found:');
  for (const i of issues) console.log(' -', i);
  process.exit(1);
}
