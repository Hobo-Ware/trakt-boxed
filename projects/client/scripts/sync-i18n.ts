/*
  i18n parity helper. Reads every JSON file under i18n/messages/ and
  ensures every non-source locale carries the full key set from the
  source locale (en.json). Missing keys get filled with the English
  value as an explicit fallback so translators can see exactly which
  surfaces still need their attention.

  Usage:
    deno task i18n:check   # report-only, exits non-zero if drift exists
    deno task i18n:sync    # write fallbacks back to disk

  Reference: ../../.agents/SESSION-STATE.md — the meta layer was
  treeshaken, paraglide reads i18n/messages/{locale}.json directly,
  so adding a new user-visible string means touching every locale file
  in lockstep. This helper is the lockstep.
*/

import { parseArgs } from '@std/cli/parse-args';
import { join } from '@std/path';

const MESSAGES_DIR = new URL('../i18n/messages/', import.meta.url).pathname;
const SOURCE_LOCALE = 'en';
const SCHEMA_KEY = '$schema';

type MessageFile = Record<string, string>;

async function readMessages(file: string): Promise<MessageFile> {
  const text = await Deno.readTextFile(file);
  return JSON.parse(text) as MessageFile;
}

async function writeMessages(
  file: string,
  messages: MessageFile,
): Promise<void> {
  /* Stable key order: schema first, then alphabetised. */
  const ordered: MessageFile = {};
  if (messages[SCHEMA_KEY] !== undefined) {
    ordered[SCHEMA_KEY] = messages[SCHEMA_KEY];
  }
  for (
    const key of Object.keys(messages).filter((k) => k !== SCHEMA_KEY).sort()
  ) {
    ordered[key] = messages[key]!;
  }
  await Deno.writeTextFile(file, JSON.stringify(ordered, null, 2) + '\n');
}

async function listLocales(): Promise<string[]> {
  const out: string[] = [];
  for await (const entry of Deno.readDir(MESSAGES_DIR)) {
    if (!entry.isFile) continue;
    if (!entry.name.endsWith('.json')) continue;
    out.push(entry.name.replace(/\.json$/, ''));
  }
  return out.sort();
}

type Drift = {
  locale: string;
  missing: string[];
  extra: string[];
};

async function diff(): Promise<Drift[]> {
  const source = await readMessages(join(MESSAGES_DIR, `${SOURCE_LOCALE}.json`));
  const sourceKeys = new Set(
    Object.keys(source).filter((k) => k !== SCHEMA_KEY),
  );

  const drifts: Drift[] = [];

  for (const locale of await listLocales()) {
    if (locale === SOURCE_LOCALE) continue;

    const target = await readMessages(join(MESSAGES_DIR, `${locale}.json`));
    const targetKeys = new Set(
      Object.keys(target).filter((k) => k !== SCHEMA_KEY),
    );

    const missing = [...sourceKeys].filter((k) => !targetKeys.has(k)).sort();
    const extra = [...targetKeys].filter((k) => !sourceKeys.has(k)).sort();

    if (missing.length || extra.length) {
      drifts.push({ locale, missing, extra });
    }
  }

  return drifts;
}

async function check(): Promise<number> {
  const drifts = await diff();

  if (drifts.length === 0) {
    console.log(
      `i18n: all locales match ${SOURCE_LOCALE}.json (parity OK).`,
    );
    return 0;
  }

  for (const { locale, missing, extra } of drifts) {
    console.error(`\n${locale}:`);
    for (const key of missing) console.error(`  - missing ${key}`);
    for (const key of extra) console.error(`  - extra   ${key}`);
  }
  console.error(`\ni18n: ${drifts.length} locale(s) drifted.`);
  return 1;
}

async function sync(): Promise<number> {
  const source = await readMessages(join(MESSAGES_DIR, `${SOURCE_LOCALE}.json`));
  const drifts = await diff();

  if (drifts.length === 0) {
    console.log('i18n: nothing to sync.');
    return 0;
  }

  for (const { locale, missing, extra } of drifts) {
    if (!missing.length && !extra.length) continue;

    const path = join(MESSAGES_DIR, `${locale}.json`);
    const target = await readMessages(path);

    for (const key of missing) {
      target[key] = source[key]!;
    }
    for (const key of extra) {
      delete target[key];
    }

    await writeMessages(path, target);
    console.log(
      `i18n: ${locale} +${missing.length} -${extra.length} (English fallback for added keys).`,
    );
  }

  return 0;
}

async function main() {
  const args = parseArgs(Deno.args, { boolean: ['sync', 'check'] });
  const mode = args.sync ? 'sync' : 'check';
  const code = mode === 'sync' ? await sync() : await check();
  Deno.exit(code);
}

await main();
