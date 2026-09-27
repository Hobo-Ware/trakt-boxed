<script lang="ts">
  import { page } from "$app/state";
  import * as m from "$lib/features/i18n/messages.ts";
  import ListsTab from "../lists/ListsTab.svelte";
  import type { ProfileContext } from "../ProfileContext.ts";
  import SubTabs from "../SubTabs.svelte";
  import { parseLikesTab } from "../_internal/parseLikesTab.ts";
  import LikesGrid from "./LikesGrid.svelte";

  const { context }: { context: ProfileContext } = $props();

  const active = $derived(
    parseLikesTab({
      tab: page.url.searchParams.get("tab"),
      mode: page.url.searchParams.get("mode"),
      isMe: context.isMe,
    }),
  );

  const tabs = $derived([
    { id: "movie", label: m.label_stats_movies() },
    { id: "show", label: m.label_stats_shows() },
    ...(context.isMe ? [{ id: "lists", label: m.list_title_liked_lists() }] : []),
  ]);
</script>

<SubTabs {tabs} {active} label={m.boxed_profile_tab_likes()} />

{#key active}
  {#if active === "lists"}
    <ListsTab slug={context.slug} type="liked" />
  {:else}
    <LikesGrid slug={context.slug} type={active} isMe={context.isMe} />
  {/if}
{/key}
