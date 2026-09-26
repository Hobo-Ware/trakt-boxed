import { walk } from 'jsr:@std/fs@^1.0.0/walk';
import { dirname, join, relative } from 'jsr:@std/path@^1.1.3';

const BOXED_ROUTES = join(import.meta.dirname!, '../src/routes');
const CLIENT_ROUTES = join(import.meta.dirname!, '../../client/src/routes');
const MARKER = 'legacy-mount';

const SKIPPED = [/^_design_system/, /^api\//, /^callback/, /^silent-redirect/];
const ROOT_FILES = new Set([
  '+layout.svelte',
  '+layout.ts',
  '+layout.server.ts',
]);

function wrapperFor(file: string, importPath: string): string | null {
  const name = file.split('/').at(-1) ?? '';

  if (name.endsWith('.ts')) {
    return `// ${MARKER}\nexport * from '${importPath}';\n`;
  }

  if (name === '+page.svelte' || name === '+error.svelte') {
    return `<!-- ${MARKER} -->\n<script lang="ts">\n  import Legacy from "${importPath}";\n\n  const props = $props();\n</script>\n\n<Legacy {...props} />\n`;
  }

  if (name === '+layout.svelte') {
    return `<!-- ${MARKER} -->\n<script lang="ts">\n  import Legacy from "${importPath}";\n\n  const props = $props();\n</script>\n\n<Legacy {...props} />\n`;
  }

  return null;
}

async function isOwnedByBoxed(target: string): Promise<boolean> {
  try {
    const text = await Deno.readTextFile(target);
    return !text.includes(MARKER);
  } catch {
    return false;
  }
}

async function hasOwnedPage(dir: string): Promise<boolean> {
  for (
    const name of ['+page.svelte', '+page.ts', '+page.server.ts', '+server.ts']
  ) {
    if (await isOwnedByBoxed(join(dir, name))) return true;
  }
  return false;
}

let written = 0;
for await (const entry of walk(CLIENT_ROUTES, { includeDirs: false })) {
  const rel = relative(CLIENT_ROUTES, entry.path);
  const name = rel.split('/').at(-1) ?? '';

  if (!name.startsWith('+')) continue;
  if (SKIPPED.some((re) => re.test(rel))) continue;
  if (!rel.includes('/') && ROOT_FILES.has(name)) continue;

  const target = join(BOXED_ROUTES, rel);
  if (await isOwnedByBoxed(target)) continue;
  if (name.startsWith('+page') && await hasOwnedPage(dirname(target))) continue;

  const importPath = relative(dirname(target), entry.path);
  const wrapper = wrapperFor(
    rel,
    importPath.startsWith('.') ? importPath : `./${importPath}`,
  );
  if (!wrapper) continue;

  await Deno.mkdir(dirname(target), { recursive: true });
  await Deno.writeTextFile(target, wrapper);
  written++;
}

console.log(`legacy mounts written: ${written}`);
