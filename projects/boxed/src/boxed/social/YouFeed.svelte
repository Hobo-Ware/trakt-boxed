<script lang="ts">
  import { useUser } from "$lib/features/auth/stores/useUser.ts";
  import * as m from "$lib/features/i18n/messages.ts";
  import { useRecentlyWatchedList } from "$lib/sections/lists/stores/useRecentlyWatchedList.ts";
  import { toDisplayableName } from "$lib/utils/profile/toDisplayableName.ts";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import ActivityFeed from "./ActivityFeed.svelte";
  import type { ActivityEvent } from "./ActivityEvent.ts";
  import { fromHistoryEntries } from "./_internal/fromHistoryEntries.ts";

  const FEED_SIZE = 40;

  const { filter }: { filter: (event: ActivityEvent) => boolean } = $props();

  const { user, ratings } = useUser();
  const { list, isLoading, hasNextPage, fetchNextPage } =
    useRecentlyWatchedList({ type: "media", slug: "me", limit: FEED_SIZE });

  const actor = $derived({
    name: $user ? toDisplayableName($user) : "",
    href: UrlBuilder.profile.me(),
    avatar: $user?.avatar.url ?? "",
  });

  const events = $derived(
    $isLoading && $list.length === 0
      ? null
      : fromHistoryEntries({ entries: $list, actor, ratings: $ratings })
        .filter(filter),
  );
</script>

<ActivityFeed
  {events}
  emptyText={m.text_cta_personal_activity()}
  hasNextPage={$hasNextPage}
  isLoading={$isLoading}
  loadedCount={$list.length}
  onLoad={fetchNextPage}
/>
