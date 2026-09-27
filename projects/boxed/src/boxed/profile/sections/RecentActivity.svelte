<script lang="ts">
  import * as m from "$lib/features/i18n/messages.ts";
  import type { PosterMedia } from "../../poster/PosterMedia.ts";
  import DiaryEntryMeta from "../diary/DiaryEntryMeta.svelte";
  import type { DiaryEntry } from "../diary/DiaryEntry.ts";
  import { isEntryLiked } from "../diary/_internal/isEntryLiked.ts";
  import { toEntryMedia } from "../diary/_internal/toEntryMedia.ts";
  import { toEntryRating } from "../diary/_internal/toEntryRating.ts";
  import { toEpisodeRange } from "../diary/_internal/toEpisodeRange.ts";
  import { toEpisodeRangeLabel } from "../diary/_internal/toEpisodeRangeLabel.ts";
  import { useDiaryUserState } from "../diary/useDiaryUserState.ts";
  import { dedupe } from "$lib/utils/array/dedupe.ts";
  import PosterQuad from "./PosterQuad.svelte";

  const {
    entries,
    isMe,
  }: { entries: ReadonlyArray<DiaryEntry> | null; isMe: boolean } = $props();

  const { userState } = $derived(useDiaryUserState(isMe));

  const recent = $derived(
    entries
      ? dedupe((entry) => toEntryMedia(entry).key, entries).slice(0, 4)
      : null,
  );
  const byKey = $derived(
    new Map(recent?.map((entry) => [toEntryMedia(entry).key, entry])),
  );
  const items = $derived(recent?.map(toEntryMedia) ?? null);

  const toSub = (entry: DiaryEntry) =>
    entry.type === "episodes"
      ? toEpisodeRangeLabel(
        toEpisodeRange(entry.plays.map((play) => play.episode)),
      )
      : undefined;
</script>

{#snippet meta(media: PosterMedia)}
  {@const entry = byKey.get(media.key)}
  {#if entry}
    <DiaryEntryMeta
      rating={toEntryRating({ entry, ratings: $userState.ratings })}
      isLiked={isEntryLiked({ entry, favorites: $userState.favorites })}
      sub={toSub(entry)}
    />
  {/if}
{/snippet}

<PosterQuad {items} {meta} emptyText={m.text_no_activity()} />
