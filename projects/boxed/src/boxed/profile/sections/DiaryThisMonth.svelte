<script lang="ts">
  import Skeleton from "$lib/components/skeleton/Skeleton.svelte";
  import { languageTag } from "$lib/features/i18n";
  import * as m from "$lib/features/i18n/messages.ts";
  import { toHumanMonth } from "$lib/utils/formatting/date/toHumanMonth.ts";
  import SectionHeader from "../../components/SectionHeader.svelte";
  import Stars from "../../components/Stars.svelte";
  import type { DiaryEntry } from "../diary/DiaryEntry.ts";
  import { toEntryRating } from "../diary/_internal/toEntryRating.ts";
  import { toEpisodeRange } from "../diary/_internal/toEpisodeRange.ts";
  import { toEpisodeRangeLabel } from "../diary/_internal/toEpisodeRangeLabel.ts";
  import { useDiaryUserState } from "../diary/useDiaryUserState.ts";

  const ROWS = 8;

  const {
    entries,
    isMe,
    href,
  }: {
    entries: ReadonlyArray<DiaryEntry> | null;
    isMe: boolean;
    href: string;
  } = $props();

  const { userState } = $derived(useDiaryUserState(isMe));

  const now = new Date();
  const month = toHumanMonth(now, languageTag());
  const rows = $derived(
    entries
      ?.filter((entry) =>
        entry.watchedAt.getFullYear() === now.getFullYear() &&
        entry.watchedAt.getMonth() === now.getMonth()
      )
      .slice(0, ROWS) ?? null,
  );
</script>

<section class="boxed-diary-this-month">
  <SectionHeader title={m.boxed_profile_diary_this_month({ month })} {href} />
  <ol class="month-rows">
    {#if rows === null}
      {#each { length: ROWS }, index (index)}
        <li><Skeleton height="var(--ni-14)" /></li>
      {/each}
    {:else if rows.length === 0}
      <li class="month-empty">{m.boxed_profile_diary_empty()}</li>
    {:else}
      {#each rows as entry (entry.key)}
        {@const rating = toEntryRating({ entry, ratings: $userState.ratings })}
        <li>
          <span class="month-day">{entry.watchedAt.getDate()}</span>
          <span class="month-title">
            {entry.type === "movie" ? entry.play.movie.title : entry.show.title}
            {#if entry.type === "episodes"}
              <span class="month-sub">
                {toEpisodeRangeLabel(
                  toEpisodeRange(entry.plays.map((play) => play.episode)),
                )}
              </span>
            {/if}
          </span>
          {#if rating !== null}<Stars {rating} />{/if}
        </li>
      {/each}
    {/if}
  </ol>
</section>

<style>
  .month-rows {
    margin: 0;
    padding: 0;
    list-style: none;
    height: calc(8 * var(--ni-28));

    li {
      height: var(--ni-28);
      display: flex;
      align-items: center;
      gap: var(--gap-s);
      font-size: var(--ni-14);
    }
  }

  .month-day {
    width: var(--ni-20);
    flex-shrink: 0;
    font-family: var(--boxed-font-mono);
    font-size: var(--ni-12);
    text-align: end;
    color: var(--color-text-secondary);
  }

  .month-title {
    flex: 1;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .month-sub {
    margin-inline-start: var(--ni-4);
    font-family: var(--boxed-font-mono);
    font-size: var(--ni-11);
    color: var(--color-text-secondary);
  }

  .month-empty {
    color: var(--color-text-secondary);
  }
</style>
