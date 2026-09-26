<script lang="ts">
  import Skeleton from "$lib/components/skeleton/Skeleton.svelte";
  import { languageTag } from "$lib/features/i18n";
  import * as m from "$lib/features/i18n/messages.ts";
  import { episodeNumberLabel } from "$lib/utils/intl/episodeNumberLabel.ts";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import type { JustWatchedEntry } from "./_internal/toJustWatched.ts";
  import { toTimeAgo } from "./_internal/toTimeAgo.ts";

  const SKELETON_COUNT = 6;

  const {
    entries,
    label,
  }: { entries: ReadonlyArray<JustWatchedEntry> | null; label: string } =
    $props();

  const now = new Date();

  const describe = ({ activity }: JustWatchedEntry) =>
    activity.type === "movie"
      ? activity.movie.title
      : `${activity.show.title} · ${episodeNumberLabel({
          seasonNumber: activity.episode.season,
          episodeNumber: activity.episode.number,
        })}`;

  const hrefFor = ({ activity }: JustWatchedEntry) =>
    activity.type === "movie"
      ? UrlBuilder.movie(activity.movie.slug)
      : UrlBuilder.show(activity.show.slug);
</script>

<ul class="boxed-just-watched" aria-label={label}>
  {#if entries === null}
    {#each { length: SKELETON_COUNT }, index (index)}
      <li class="boxed-just-watched-item" aria-hidden="true">
        <span class="boxed-just-watched-ring">
          <Skeleton width="var(--ni-56)" height="var(--ni-56)" radius="50%" />
        </span>
        <span class="boxed-just-watched-name"><Skeleton width="var(--ni-60)" height="var(--ni-12)" /></span>
        <span class="boxed-just-watched-what"><Skeleton width="var(--ni-72)" height="var(--ni-11)" /></span>
        <span class="boxed-just-watched-when"><Skeleton width="var(--ni-48)" height="var(--ni-11)" /></span>
      </li>
    {/each}
  {:else if entries.length === 0}
    <li class="boxed-just-watched-empty">{m.text_no_activity()}</li>
  {:else}
    {#each entries as entry (entry.friend.id)}
      <li class="boxed-just-watched-item" data-hj-suppress>
        <a href={hrefFor(entry)} class="boxed-just-watched-link">
          <span class="boxed-just-watched-ring">
            <img
              src={entry.friend.avatar.url}
              alt=""
              width="56"
              height="56"
              loading="lazy"
            />
          </span>
          <span class="boxed-just-watched-name">{entry.friend.username}</span>
          <span class="boxed-just-watched-what" title={describe(entry)}>
            {describe(entry)}
          </span>
          <span class="boxed-just-watched-when">
            {toTimeAgo(now, entry.activity.activityAt, languageTag())}
          </span>
        </a>
      </li>
    {/each}
  {/if}
</ul>

<style>
  .boxed-just-watched {
    margin: 0;
    padding: var(--ni-4) 0 var(--ni-8);
    list-style: none;

    display: grid;
    grid-auto-flow: column;
    grid-auto-columns: var(--ni-96);
    gap: var(--gap-m);
    overflow-x: auto;
    scrollbar-width: none;
    min-height: var(--ni-132);
  }

  .boxed-just-watched-item,
  .boxed-just-watched-link {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--ni-4);
    min-width: 0;
    text-align: center;
    text-decoration: none;
    color: inherit;
  }

  .boxed-just-watched-ring {
    width: var(--ni-64);
    height: var(--ni-64);
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    box-shadow: 0 0 0 var(--border-thickness-xs) var(--purple-400);

    img {
      width: var(--ni-56);
      height: var(--ni-56);
      border-radius: 50%;
      object-fit: cover;
      background: var(--color-input-background);
    }
  }

  .boxed-just-watched-empty {
    grid-column: 1 / -1;
    align-self: center;
    width: max-content;
    font-size: var(--ni-14);
    color: var(--color-text-secondary);
  }

  .boxed-just-watched-name {
    width: 100%;
    min-height: var(--ni-16);
    font-size: var(--ni-12);
    font-weight: 600;
    color: var(--color-text-primary);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .boxed-just-watched-what,
  .boxed-just-watched-when {
    width: 100%;
    min-height: var(--ni-14);
    font-size: var(--ni-11);
    color: var(--color-text-secondary);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
</style>
