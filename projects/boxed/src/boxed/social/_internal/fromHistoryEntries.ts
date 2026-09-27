import type { RatingsLookup } from '$boxed/utils/RatingsLookup.ts';
import { toPlaysRating } from '$boxed/utils/toPlaysRating.ts';
import type { EpisodeEntry } from '$lib/requests/models/EpisodeEntry.ts';
import type { EpisodeActivityHistory } from '$lib/requests/queries/users/episodeActivityHistoryQuery.ts';
import type { HistoryEntry } from '$lib/sections/lists/stores/models/HistoryEntry.ts';
import { getDayKey } from '$lib/utils/date/getDayKey.ts';
import { episodeSubtitle } from '$lib/utils/intl/episodeSubtitle.ts';
import { multiEpisodeLabel } from '$lib/utils/intl/multiEpisodeLabel.ts';
import { UrlBuilder } from '$lib/utils/url/UrlBuilder.ts';
import type { ActivityActor, ActivityEvent } from '../ActivityEvent.ts';

type FromHistoryEntriesParams = {
  entries: ReadonlyArray<HistoryEntry>;
  actor: ActivityActor;
  ratings: RatingsLookup | Nil;
};

type Session =
  | { type: 'movie'; entry: Extract<HistoryEntry, { type: 'movie' }> }
  | { type: 'episode'; plays: EpisodeActivityHistory[] };

function isSameSession(
  plays: ReadonlyArray<EpisodeActivityHistory>,
  entry: EpisodeActivityHistory,
) {
  const last = plays.at(-1);
  if (!last) return false;

  return last.show.id === entry.show.id &&
    last.episode.season === entry.episode.season &&
    getDayKey(last.watchedAt) === getDayKey(entry.watchedAt);
}

function toSessions(entries: ReadonlyArray<HistoryEntry>): Session[] {
  return entries.reduce<Session[]>((sessions, entry) => {
    const last = sessions.at(-1);

    if (entry.type === 'movie') return [...sessions, { type: 'movie', entry }];

    if (last?.type === 'episode' && isSameSession(last.plays, entry)) {
      return [
        ...sessions.slice(0, -1),
        { type: 'episode', plays: [...last.plays, entry] },
      ];
    }

    return [...sessions, { type: 'episode', plays: [entry] }];
  }, []);
}

function toEpisodeCode(plays: ReadonlyArray<EpisodeActivityHistory>) {
  const [only, ...rest] = plays;
  if (only && rest.length === 0) return episodeSubtitle(only.episode);

  const episodes: EpisodeEntry[] = plays
    .map((play) => play.episode)
    .toSorted((a, b) => a.number - b.number);

  return multiEpisodeLabel(episodes, plays.at(0)?.episode.season ?? 0);
}

function toEpisodeRating(
  plays: ReadonlyArray<EpisodeActivityHistory>,
  ratings: RatingsLookup | Nil,
) {
  return toPlaysRating({
    episodeIds: plays.map((play) => play.episode.id),
    showId: plays.at(0)?.show.id,
    ratings,
  });
}

export function fromHistoryEntries(
  { entries, actor, ratings }: FromHistoryEntriesParams,
): ActivityEvent[] {
  return toSessions(entries).flatMap((session): ActivityEvent[] => {
    if (session.type === 'movie') {
      const { entry } = session;
      return [{
        key: entry.key,
        at: entry.watchedAt,
        actor,
        others: 0,
        type: 'movie',
        title: entry.movie.title,
        code: null,
        href: UrlBuilder.movie(entry.movie.slug),
        poster: entry.movie.poster.url.thumb,
        rating: ratings?.movies.get(entry.movie.id)?.rating ?? null,
      }];
    }

    const latest = session.plays.at(0);
    if (!latest) return [];

    return [{
      key: latest.key,
      at: latest.watchedAt,
      actor,
      others: 0,
      type: 'episode',
      title: latest.show.title,
      code: toEpisodeCode(session.plays),
      href: UrlBuilder.show(latest.show.slug),
      poster: latest.show.poster.url.thumb,
      rating: toEpisodeRating(session.plays, ratings),
    }];
  });
}
