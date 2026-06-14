// Dep-tree walker. Starts from SvelteKit entry files and produces:
//  - reached: set of files reachable from entries
//  - orphans: lib files not reached
//
// Run: deno run -A scripts/find-orphans.ts
import { walk } from 'jsr:@std/fs/walk';
import { dirname, join, relative, resolve } from 'jsr:@std/path';

const ROOT = resolve(new URL('..', import.meta.url).pathname);
const SRC = join(ROOT, 'src');

const ALIASES: Record<string, string> = {
  '$lib': join(SRC, 'lib'),
  '$mocks': join(SRC, 'mocks'),
  '$worker': join(SRC, 'worker'),
  '$style': join(SRC, 'style'),
  '$test': join(ROOT, 'test'),
  '$e2e': join(ROOT, 'e2e'),
};

// External-ish prefixes to ignore.
const IGNORE_PREFIXES = [
  '$app/',
  '$env/',
  '$service-worker',
  '$types/',
  'svelte',
  'rxjs',
  'zod',
  'msw',
  'date-fns',
  '@sveltejs/',
  '@tanstack/',
  '@inlang/',
  '@trakt/',
  'jsr:',
  'node:',
];

const IMPORT_RE =
  /(?:import|export)\s+(?:[^'"]*?from\s+)?['"]([^'"]+)['"]|import\s*\(\s*['"]([^'"]+)['"]\s*\)/g;
const CSS_USE_RE = /@use\s+['"]([^'"]+)['"]/g;
// Svelte action / dynamic component / route hrefs are out of scope.

async function fileExists(path: string): Promise<boolean> {
  try {
    await Deno.stat(path);
    return true;
  } catch {
    return false;
  }
}

async function resolveImport(
  spec: string,
  fromFile: string,
): Promise<string | null> {
  // Strip query and hash.
  spec = spec.split('?')[0].split('#')[0];

  if (!spec) return null;
  if (IGNORE_PREFIXES.some((p) => spec === p.replace(/\/$/, '') || spec.startsWith(p))) {
    return null;
  }
  if (/^[a-zA-Z@][\w\-@/.]*$/.test(spec) && !spec.startsWith('.') && !spec.startsWith('$')) {
    // bare package — skip.
    return null;
  }

  let basePath: string;
  if (spec.startsWith('$')) {
    const aliasKey = Object.keys(ALIASES).find((k) =>
      spec === k || spec.startsWith(`${k}/`)
    );
    if (!aliasKey) return null;
    basePath = join(ALIASES[aliasKey], spec.slice(aliasKey.length + 1));
    if (spec === aliasKey) basePath = ALIASES[aliasKey];
  } else if (spec.startsWith('.')) {
    basePath = resolve(dirname(fromFile), spec);
  } else {
    return null;
  }

  // Imports may use `.js` extension as ESM convention while the source file
  // is `.ts` — strip and try the bare basename too.
  const stripped = basePath.replace(/\.(?:js|ts|svelte|scss|css)$/, '');
  const candidates = [
    basePath,
    `${basePath}.ts`,
    `${basePath}.svelte`,
    `${basePath}.js`,
    `${basePath}.scss`,
    `${basePath}.css`,
    `${stripped}.ts`,
    `${stripped}.svelte`,
    `${basePath}/index.ts`,
    `${basePath}/index.js`,
  ];
  for (const c of candidates) {
    if (await fileExists(c)) {
      try {
        const stat = await Deno.stat(c);
        if (stat.isFile) return c;
      } catch {
        // ignore
      }
    }
  }
  return null;
}

async function readImports(file: string): Promise<string[]> {
  let content: string;
  try {
    content = await Deno.readTextFile(file);
  } catch {
    return [];
  }
  const specs: string[] = [];
  for (const m of content.matchAll(IMPORT_RE)) {
    const spec = m[1] ?? m[2];
    if (spec) specs.push(spec);
  }
  if (file.endsWith('.scss') || file.endsWith('.css') || file.endsWith('.svelte')) {
    for (const m of content.matchAll(CSS_USE_RE)) {
      specs.push(m[1]);
    }
  }
  return specs;
}

async function collectEntries(): Promise<string[]> {
  const entries: string[] = [];
  for await (const e of walk(join(SRC, 'routes'), { exts: ['svelte', 'ts'] })) {
    if (!e.isFile) continue;
    const name = e.path.split('/').pop()!;
    if (
      name.startsWith('+page.') ||
      name.startsWith('+layout.') ||
      name.startsWith('+server.') ||
      name === 'hooks.server.ts' ||
      name === 'hooks.client.ts'
    ) {
      entries.push(e.path);
    }
  }
  // Top-level hooks
  for (const f of ['hooks.server.ts', 'hooks.client.ts', 'app.html']) {
    const p = join(SRC, f);
    if (await fileExists(p)) entries.push(p);
  }
  // Build-time configs referencing src/lib code.
  for (const f of ['vite.config.ts', 'svelte.config.js']) {
    const p = join(ROOT, f);
    if (await fileExists(p)) entries.push(p);
  }
  // i18n generator (CLI build script) also reaches into src/lib.
  const i18nDir = join(ROOT, 'i18n');
  if (await fileExists(i18nDir)) {
    for await (
      const e of walk(i18nDir, { exts: ['ts'] })
    ) {
      if (!e.isFile) continue;
      if (e.path.endsWith('.spec.ts') || e.path.endsWith('.test.ts')) continue;
      entries.push(e.path);
    }
  }
  // mocks bootstrap & MSW server — kept as live for testing infra.
  return entries;
}

async function main() {
  const entries = await collectEntries();
  const reached = new Set<string>();
  const stack = [...entries];

  while (stack.length) {
    const file = stack.pop()!;
    if (reached.has(file)) continue;
    reached.add(file);
    const imports = await readImports(file);
    for (const spec of imports) {
      const resolved = await resolveImport(spec, file);
      if (resolved && !reached.has(resolved)) stack.push(resolved);
    }
  }

  // All candidate files in src/lib (excluding paraglide generated + spec/test).
  const candidates: string[] = [];
  for await (
    const e of walk(join(SRC, 'lib'), { exts: ['ts', 'svelte', 'js'] })
  ) {
    if (!e.isFile) continue;
    if (e.path.includes('/paraglide/')) continue;
    if (e.path.endsWith('.spec.ts') || e.path.endsWith('.test.ts')) continue;
    candidates.push(e.path);
  }

  const orphans = candidates.filter((f) => !reached.has(f));
  orphans.sort();
  for (const o of orphans) {
    console.log(relative(SRC, o));
  }
  console.error(`reached=${reached.size} candidates=${candidates.length} orphans=${orphans.length}`);
}

await main();
