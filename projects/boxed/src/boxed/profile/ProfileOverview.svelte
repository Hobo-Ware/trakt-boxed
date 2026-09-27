<script lang="ts">
  import * as m from "$lib/features/i18n/messages.ts";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import { useRecentlyWatchedList } from "$lib/sections/lists/stores/useRecentlyWatchedList.ts";
  import ProfileDrawer from "$lib/sections/profile/ProfileDrawer.svelte";
  import InView from "../components/InView.svelte";
  import SectionHeader from "../components/SectionHeader.svelte";
  import { toDiaryEntries } from "./diary/toDiaryEntries.ts";
  import type { ProfileContext } from "./ProfileContext.ts";
  import CurrentlyWatching from "./sections/CurrentlyWatching.svelte";
  import CurrentlyWatchingSkeleton from "./sections/CurrentlyWatchingSkeleton.svelte";
  import DiaryThisMonth from "./sections/DiaryThisMonth.svelte";
  import FacesGrid from "./sections/FacesGrid.svelte";
  import FavoritesQuad from "./sections/FavoritesQuad.svelte";
  import FollowingFaces from "./sections/FollowingFaces.svelte";
  import NowWatchingCard from "./sections/NowWatchingCard.svelte";
  import RatingsHistogram from "./sections/RatingsHistogram.svelte";
  import RecentActivity from "./sections/RecentActivity.svelte";
  import YearHeatmap from "./sections/YearHeatmap.svelte";

  const HISTORY_SIZE = 50;

  const { context }: { context: ProfileContext } = $props();
  const slug = $derived(context.slug);

  const { list: history, isLoading: isHistoryLoading } = $derived(
    useRecentlyWatchedList({ type: "media", slug, limit: HISTORY_SIZE }),
  );

  const entries = $derived(
    $isHistoryLoading && $history.length === 0
      ? null
      : toDiaryEntries($history),
  );
  const profileHref = $derived(`/profile/${slug}`);
</script>

<div class="boxed-profile-overview">
  <div class="overview-main">
    <FavoritesQuad {slug} type="movie" title={m.list_title_favorite_movies()} />
    <FavoritesQuad {slug} type="show" title={m.list_title_favorite_shows()} />

    <section>
      <SectionHeader
        title={m.boxed_profile_currently_watching()}
        href={context.isMe ? `${profileHref}/watching` : undefined}
      />
      <InView>
        {#if context.isMe}
          <CurrentlyWatching {slug} />
        {:else}
          <NowWatchingCard {slug} />
        {/if}
        {#snippet placeholder()}
          <CurrentlyWatchingSkeleton withInProgress={context.isMe} />
        {/snippet}
      </InView>
    </section>

    <section>
      <SectionHeader
        title={m.boxed_profile_recent_activity()}
        href={`${profileHref}/diary`}
      />
      <RecentActivity {entries} isMe={context.isMe} />
    </section>
  </div>

  <aside class="overview-aside">
    <RatingsHistogram stats={context.stats} />
    <DiaryThisMonth {entries} isMe={context.isMe} href={`${profileHref}/diary`} />

    {#if context.isMe}
      <YearHeatmap />
    {/if}

    <section>
      <SectionHeader
        title={m.text_following()}
        href={`${profileHref}/social`}
      />
      <InView>
        <FollowingFaces {slug} />
        {#snippet placeholder()}
          <FacesGrid profiles={null} />
        {/snippet}
      </InView>
    </section>
  </aside>
</div>

<RenderFor audience="authenticated">
  {#if context.profile}
    <ProfileDrawer {slug} profile={context.profile} />
  {/if}
</RenderFor>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .boxed-profile-overview {
    display: grid;
    grid-template-columns: minmax(0, 1fr) var(--ni-320);
    align-items: start;
    gap: var(--ni-56);

    @include for-tablet-sm-and-below {
      grid-template-columns: minmax(0, 1fr);
      gap: var(--ni-28);
    }
  }

  .overview-main,
  .overview-aside {
    display: flex;
    flex-direction: column;
    gap: var(--ni-40);
    min-width: 0;

    @include for-mobile {
      gap: var(--ni-28);
    }
  }




</style>
