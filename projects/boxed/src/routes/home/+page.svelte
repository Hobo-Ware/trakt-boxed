<script lang="ts">
  import InView from "$boxed/components/InView.svelte";
  import PageContainer from "$boxed/components/PageContainer.svelte";
  import SectionHeader from "$boxed/components/SectionHeader.svelte";
  import Stars from "$boxed/components/Stars.svelte";
  import FriendFaces from "$boxed/home/FriendFaces.svelte";
  import JustWatchedRail from "$boxed/home/JustWatchedRail.svelte";
  import UpNextCard from "$boxed/home/UpNextCard.svelte";
  import UpNextSkeleton from "$boxed/home/UpNextSkeleton.svelte";
  import { toFriendsPosters } from "$boxed/home/_internal/toFriendsPosters.ts";
  import { toJustWatched } from "$boxed/home/_internal/toJustWatched.ts";
  import OutThisWeekRow from "$boxed/home/sections/OutThisWeekRow.svelte";
  import PopularRow from "$boxed/home/sections/PopularRow.svelte";
  import RecommendedRow from "$boxed/home/sections/RecommendedRow.svelte";
  import StartWatchingRow from "$boxed/home/sections/StartWatchingRow.svelte";
  import PosterRow from "$boxed/poster/PosterRow.svelte";
  import type { PosterMedia } from "$boxed/poster/PosterMedia.ts";
  import { useUser } from "$lib/features/auth/stores/useUser.ts";
  import * as m from "$lib/features/i18n/messages.ts";
  import TraktPage from "$lib/sections/layout/TraktPage.svelte";
  import { useActivityList } from "$lib/sections/lists/activity/useActivityList.ts";
  import { useUpNextList } from "$lib/sections/lists/progress/useUpNextList.ts";
  import { useStreak } from "$lib/sections/stats/useStreak.ts";
  import type { UpNextEntry } from "$lib/requests/models/UpNextEntry.ts";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";

  const FEED_SIZE = 40;
  const UP_NEXT_SIZE = 3;
  const FRIENDS_POSTERS = 12;
  const JUST_WATCHED_WINDOWS = [6, 72, 24 * 14];

  const { user } = useUser();
  const { streakCount } = useStreak({ mode: "media" });
  const { list: activities, isLoading: isLoadingActivities } = useActivityList(
    { type: "media", limit: FEED_SIZE },
  );
  const { list: upNext, isLoading: isLoadingUpNext } = useUpNextList({
    type: "show",
    limit: UP_NEXT_SIZE,
  });

  const now = new Date();
  const justWatched = $derived.by(() => {
    if ($isLoadingActivities) return null;

    for (const windowHours of JUST_WATCHED_WINDOWS) {
      const entries = toJustWatched({ activities: $activities, now, windowHours });
      if (entries.length > 0) return entries;
    }
    return [];
  });

  const friendsPosters = $derived(
    toFriendsPosters($activities, FRIENDS_POSTERS),
  );
  const friendsByKey = $derived(
    new Map(friendsPosters.map((poster) => [poster.media.key, poster])),
  );
  const upNextEpisodes = $derived(
    $upNext.filter((entry): entry is UpNextEntry => "show" in entry),
  );

  const firstName = $derived($user?.name?.first || $user?.username || "");
</script>

{#snippet friendsMeta(media: PosterMedia)}
  {@const poster = friendsByKey.get(media.key)}
  {#if poster}
    <span class="boxed-friends-meta">
      <FriendFaces friends={poster.friends} />
      {#if poster.rating}<Stars rating={poster.rating} />{/if}
    </span>
  {/if}
{/snippet}

{#snippet lazyRow(title: string, href?: string, showMeta = false)}
  <SectionHeader {title} {href} />
  <PosterRow label={title} items={null} showUserMeta={showMeta} />
{/snippet}

<TraktPage
  audience="authenticated"
  type="home"
  title={m.page_title_home()}
  image={null}
>
  <PageContainer>
    <header class="boxed-home-header">
      <div class="boxed-home-greeting">
        <h1>{m.boxed_home_greeting({ name: firstName })}</h1>
        <p>{m.boxed_home_subtitle()}</p>
      </div>
      <span class="boxed-home-streak" aria-live="polite">
        {#if $streakCount > 0}
          {$streakCount === 1
            ? m.text_stats_day_count({ count: String($streakCount) })
            : m.text_stats_days_count({ count: String($streakCount) })}
          {m.text_stats_watching_streak()}
        {/if}
      </span>
    </header>

    <section>
      <SectionHeader
        title={m.boxed_home_just_watched()}
        href={UrlBuilder.social.activity()}
      />
      <JustWatchedRail entries={justWatched} label={m.boxed_home_just_watched()} />
    </section>

    <section>
      <SectionHeader
        title={m.list_title_up_next()}
        href={`${UrlBuilder.profile.me()}/watching`}
      />
      <div class="boxed-up-next-grid">
        {#if $isLoadingUpNext}
          {#each { length: 3 }, index (index)}
            <UpNextSkeleton />
          {/each}
        {:else if upNextEpisodes.length === 0}
          <div class="boxed-up-next-empty">
            <UpNextSkeleton hidden />
            <span>{m.text_season_complete()}</span>
          </div>
        {:else}
          {#each upNextEpisodes.slice(0, UP_NEXT_SIZE) as entry (entry.show.key)}
            <UpNextCard {entry} />
          {/each}
        {/if}
      </div>
    </section>

    <section>
      <SectionHeader title={m.boxed_home_new_from_friends()} />
      <PosterRow
        label={m.boxed_home_new_from_friends()}
        items={$isLoadingActivities
          ? null
          : friendsPosters.map((poster) => poster.media)}
        meta={friendsMeta}
        emptyText={m.text_no_activity()}
      />
    </section>

    <section>
      <InView>
        <SectionHeader
          title={m.list_title_start_watching()}
          href={`${UrlBuilder.profile.me()}/watchlist`}
        />
        <StartWatchingRow />
        {#snippet placeholder()}
          {@render lazyRow(
            m.list_title_start_watching(),
            `${UrlBuilder.profile.me()}/watchlist`,
          )}
        {/snippet}
      </InView>
    </section>

    <section>
      <InView>
        <SectionHeader
          title={m.boxed_home_out_this_week()}
          href={UrlBuilder.calendar()}
        />
        <OutThisWeekRow />
        {#snippet placeholder()}
          {@render lazyRow(
            m.boxed_home_out_this_week(),
            UrlBuilder.calendar(),
            true,
          )}
        {/snippet}
      </InView>
    </section>

    <section>
      <InView>
        <SectionHeader
          title={m.list_title_most_popular()}
          href={UrlBuilder.popular()}
        />
        <PopularRow />
        {#snippet placeholder()}
          {@render lazyRow(m.list_title_most_popular(), UrlBuilder.popular())}
        {/snippet}
      </InView>
    </section>

    <section>
      <InView>
        <SectionHeader
          title={m.list_title_recommended()}
          href={UrlBuilder.recommended()}
        />
        <RecommendedRow />
        {#snippet placeholder()}
          {@render lazyRow(m.list_title_recommended(), UrlBuilder.recommended())}
        {/snippet}
      </InView>
    </section>
  </PageContainer>
</TraktPage>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .boxed-home-header {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: var(--gap-m);

    @include for-tablet-sm-and-below {
      flex-direction: column;
      align-items: flex-start;
    }
  }

  .boxed-home-greeting {
    display: flex;
    flex-direction: column;
    gap: var(--ni-6);

    h1 {
      min-height: 1.2em;
      margin: 0;
      font-family: var(--boxed-font-title);
      font-size: var(--ni-40);
      font-weight: 600;
      line-height: 1.2;
      letter-spacing: -0.01em;

      @include for-mobile {
        font-size: var(--ni-28);
      }
    }

    p {
      margin: 0;
      font-size: var(--ni-16);
      color: var(--color-text-secondary);
    }
  }

  .boxed-home-streak {
    min-height: var(--ni-32);
    display: inline-flex;
    align-items: center;
    padding-inline: var(--ni-12);

    border-radius: var(--border-radius-xxl);
    background: var(--boxed-color-accent-soft);
    color: var(--boxed-color-accent-text);
    font-size: var(--ni-12);
    font-weight: 600;

    &:empty {
      visibility: hidden;
    }
  }

  .boxed-up-next-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: var(--gap-l);

    @include for-tablet-sm-and-below {
      grid-auto-flow: column;
      grid-template-columns: none;
      grid-auto-columns: minmax(var(--ni-280), 80%);
      overflow-x: auto;
      scroll-snap-type: inline mandatory;
      scrollbar-width: none;

      > :global(*) {
        scroll-snap-align: start;
      }
    }
  }

  .boxed-up-next-empty {
    position: relative;

    span {
      position: absolute;
      inset: 0;
      display: flex;
      align-items: center;
      font-size: var(--ni-14);
      color: var(--color-text-secondary);
    }
  }

  .boxed-friends-meta {
    display: flex;
    align-items: center;
    gap: var(--gap-xs);
    min-width: 0;
  }
</style>
