<script lang="ts">
  import { page } from "$app/state";
  import { useFollowing } from "$lib/sections/profile/stores/useFollowing.ts";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { ProfileContext } from "../ProfileContext.ts";
  import SubTabs from "../SubTabs.svelte";
  import { parseNetworkTab } from "../_internal/parseNetworkTab.ts";
  import NetworkList from "./NetworkList.svelte";

  const { context }: { context: ProfileContext } = $props();

  const active = $derived(
    parseNetworkTab({
      value: page.url.searchParams.get("tab"),
      isMe: context.isMe,
    }),
  );

  const { profiles: requests } = $derived(
    useFollowing(context.slug, context.isMe ? "requests" : "following"),
  );
  const requestCount = $derived(context.isMe ? $requests.length : 0);

  const withCount = (label: string, count: number | Nil) =>
    count ? `${label} ${count}` : label;

  const tabs = $derived([
    {
      id: "following",
      label: withCount(
        m.button_text_following(),
        context.stats?.network.following,
      ),
    },
    {
      id: "followers",
      label: withCount(
        m.button_text_followers(),
        context.stats?.network.followers,
      ),
    },
    ...(context.isMe && (requestCount > 0 || active === "requests")
      ? [
        {
          id: "requests",
          label: withCount(m.button_text_follow_requests(), requestCount),
        },
      ]
      : []),
  ]);

  const expectedCount = $derived.by(() => {
    if (active === "following") return context.stats?.network.following;
    if (active === "followers") return context.stats?.network.followers;
    return requestCount;
  });

  const emptyText = $derived.by(() => {
    if (active === "following") return m.list_placeholder_following();
    if (active === "followers") return m.list_placeholder_followers();
    return m.list_placeholder_follow_requests();
  });
</script>

<SubTabs {tabs} {active} label={m.header_network()} />

{#key active}
  <NetworkList slug={context.slug} type={active} {expectedCount} {emptyText} />
{/key}
