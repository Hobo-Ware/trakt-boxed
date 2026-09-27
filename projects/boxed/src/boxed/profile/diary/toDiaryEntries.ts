import type { EpisodeActivityHistory } from '$lib/requests/queries/users/episodeActivityHistoryQuery.ts';
import type { HistoryEntry } from '$lib/sections/lists/stores/models/HistoryEntry.ts';
import { getDayKey } from '$lib/utils/date/getDayKey.ts';
import type { DiaryEntry, DiaryEpisodesEntry } from '../DiaryEntry.ts';
import { findRewatches } from './findRewatches.ts';

type EpisodeGroup = {
  first: EpisodeActivityHistory;
  plays: EpisodeActivityHistory[];
};

const toGroupKey = (play: EpisodeActivityHistory) =>
  `${play.show.id}:${getDayKey(play.watchedAt)}`;

const byEpisodeOrder = (
  a: EpisodeActivityHistory,
  b: EpisodeActivityHistory,
) =>
  a.episode.season - b.episode.season ||
  a.episode.number - b.episode.number ||
  a.watchedAt.getTime() - b.watchedAt.getTime();

function toEpisodesEntry(
  group: EpisodeGroup,
  rewatches: ReadonlySet<string>,
): DiaryEpisodesEntry {
  return {
    type: 'episodes',
    key: `episodes-${toGroupKey(group.first)}`,
    watchedAt: group.first.watchedAt,
    show: group.first.show,
    plays: group.plays.toSorted(byEpisodeOrder),
    isRewatch: group.plays.every((play) => rewatches.has(play.key)),
  };
}

export function toDiaryEntries(
  plays: ReadonlyArray<HistoryEntry>,
): DiaryEntry[] {
  const rewatches = findRewatches(plays);

  const groups = plays.reduce((acc, play) => {
    if (play.type !== 'episode') return acc;

    const groupKey = toGroupKey(play);
    const group = acc.get(groupKey);
    if (group) group.plays.push(play);
    else acc.set(groupKey, { first: play, plays: [play] });
    return acc;
  }, new Map<string, EpisodeGroup>());

  return plays.flatMap((play): DiaryEntry[] => {
    if (play.type === 'movie') {
      return [{
        type: 'movie',
        key: play.key,
        watchedAt: play.watchedAt,
        play,
        isRewatch: rewatches.has(play.key),
      }];
    }

    if (play.type !== 'episode') return [];

    const group = groups.get(toGroupKey(play));
    if (!group || group.first !== play) return [];

    return [toEpisodesEntry(group, rewatches)];
  });
}
