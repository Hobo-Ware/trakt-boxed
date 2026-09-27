<script lang="ts">
  import { page } from "$app/state";
  import * as m from "$lib/features/i18n/messages.ts";
  import ProfileNotice from "../ProfileNotice.svelte";
  import type { ProfileContext } from "../ProfileContext.ts";
  import SubTabs from "../SubTabs.svelte";
  import { parseWatchingTab } from "../_internal/parseWatchingTab.ts";
  import CompletedTab from "./CompletedTab.svelte";
  import ProgressTab from "./ProgressTab.svelte";
  import StartWatchingTab from "./StartWatchingTab.svelte";
  import UpNextTab from "./UpNextTab.svelte";

  const { context }: { context: ProfileContext } = $props();

  const active = $derived(parseWatchingTab(page.url.searchParams.get("tab")));

  const tabs = [
    { id: "up-next", label: m.boxed_log_up_next() },
    { id: "in-progress", label: m.button_text_progress_in_progress() },
    { id: "start-watching", label: m.list_title_start_watching() },
    { id: "dropped", label: m.button_text_progress_dropped() },
    { id: "completed", label: m.boxed_profile_tab_completed() },
  ];
</script>

{#if !context.isMe}
  <ProfileNotice text={m.boxed_profile_owner_only({ name: context.name })} />
{:else}
  <SubTabs {tabs} {active} label={m.boxed_profile_tab_watching()} />

  {#key active}
    {#if active === "up-next"}
      <UpNextTab />
    {:else if active === "in-progress"}
      <ProgressTab type="in-progress" />
    {:else if active === "start-watching"}
      <StartWatchingTab />
    {:else if active === "dropped"}
      <ProgressTab type="dropped" />
    {:else}
      <CompletedTab />
    {/if}
  {/key}
{/if}
