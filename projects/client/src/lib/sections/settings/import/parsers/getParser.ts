import type { ImportSource } from '../ImportTypes.ts';
import { ImdbParser } from './ImdbParser.ts';
import { LetterboxdParser } from './LetterboxdParser.ts';
import type { FileParser } from './ParserInterface.ts';
import { TraktCsvParser } from './TraktCsvParser.ts';
import { TraktJsonParser } from './TraktJsonParser.ts';

const PARSER_MAP: Record<ImportSource, FileParser> = {
  letterboxd: LetterboxdParser,
  imdb: ImdbParser,
  'trakt-csv': TraktCsvParser,
  'trakt-json': TraktJsonParser,
};

export function getParser(source: ImportSource): FileParser {
  return PARSER_MAP[source];
}
