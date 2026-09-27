import type { TitleFact } from './TitleFact.ts';

export function compactFacts(
  facts: ReadonlyArray<TitleFact | null>,
): ReadonlyArray<TitleFact> {
  return facts.filter((fact): fact is TitleFact => fact !== null);
}
