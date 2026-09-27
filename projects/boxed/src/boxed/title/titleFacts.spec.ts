import type { CastMember, CrewMember } from '$lib/requests/models/MediaCrew.ts';
import { describe, expect, it } from 'vitest';
import { compactFacts } from './compactFacts.ts';
import { toCastChips } from './toCastChips.ts';
import { toCommonFacts } from './toCommonFacts.ts';
import { toCrewChips } from './toCrewChips.ts';
import { toGenreChips } from './toGenreChips.ts';
import { toRuntimeMeta } from './toRuntimeMeta.ts';

const cast = (key: string) => ({ key, name: key.toUpperCase() }) as CastMember;
const crew = (key: string, jobs: string[]) =>
  ({ key, name: key.toUpperCase(), jobs }) as CrewMember;

describe('util: toCastChips', () => {
  it('should link the first cast members to their pages', () => {
    const chips = toCastChips([cast('a'), cast('b'), cast('c')], 2);

    expect(chips.map((chip) => chip.label)).toEqual(['A', 'B']);
    expect(chips.at(0)?.href).toContain('/people/a');
  });
});

describe('util: toCrewChips', () => {
  it('should key each member by person and jobs', () => {
    const chips = toCrewChips([crew('a', ['Director', 'Writer'])]);

    expect(chips.at(0)?.key).toBe('a-Director-Writer');
    expect(chips.at(0)?.detail).toContain(', ');
  });
});

describe('util: toGenreChips', () => {
  it('should use the genre slug as the key', () => {
    expect(toGenreChips(['drama']).at(0)?.key).toBe('drama');
  });
});

describe('util: toRuntimeMeta', () => {
  it('should join runtime and certification', () => {
    expect(
      toRuntimeMeta({ runtime: 90, certification: 'PG', locale: 'en' }),
    ).toBe('1h 30m · PG');
  });

  it('should skip what is missing', () => {
    expect(
      toRuntimeMeta({ runtime: NaN, certification: null, locale: 'en' }),
    ).toBe('');
  });
});

describe('util: toCommonFacts', () => {
  it('should only list an original title that differs', () => {
    const same = toCommonFacts({
      media: { title: 'Dune', originalTitle: 'Dune' },
      studios: [],
      locale: 'en',
    });
    const other = toCommonFacts({
      media: { title: 'Amélie', originalTitle: "Le Fabuleux Destin d'Amélie" },
      studios: [],
      locale: 'en',
    });

    expect(same.original).toBeNull();
    expect(other.original?.value).toBe("Le Fabuleux Destin d'Amélie");
  });

  it('should name the country and languages', () => {
    const facts = toCommonFacts({
      media: { title: 'x', country: 'us', languages: ['en'] },
      studios: [],
      locale: 'en',
    });

    expect(facts.country?.value).toBe('United States');
    expect(facts.language?.value).toBe('English');
    expect(facts.studio).toBeNull();
  });
});

describe('util: compactFacts', () => {
  it('should drop missing facts and keep the order', () => {
    const fact = (key: string) => ({ key, label: key, value: key });

    expect(compactFacts([fact('a'), null, fact('b')]).map((f) => f.key))
      .toEqual(['a', 'b']);
  });
});
