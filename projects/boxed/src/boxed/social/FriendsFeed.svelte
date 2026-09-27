<script lang="ts">
  import * as m from "$lib/features/i18n/messages.ts";
  import { useActivityList } from "$lib/sections/lists/activity/useActivityList.ts";
  import ActivityFeed from "./ActivityFeed.svelte";
  import type { ActivityEvent } from "./ActivityEvent.ts";
  import { fromSocialActivity } from "./_internal/fromSocialActivity.ts";

  const FEED_SIZE = 40;

  const { filter }: { filter: (event: ActivityEvent) => boolean } = $props();

  const { list, isLoading, hasNextPage, fetchNextPage } = useActivityList({
    type: "media",
    limit: FEED_SIZE,
  });

  const events = $derived(
    $isLoading && $list.length === 0
      ? null
      : $list.map(fromSocialActivity).filter(filter),
  );
</script>

<ActivityFeed
  {events}
  emptyText={m.text_cta_activity_list()}
  hasNextPage={$hasNextPage}
  isLoading={$isLoading}
  loadedCount={$list.length}
  onLoad={fetchNextPage}
/>
