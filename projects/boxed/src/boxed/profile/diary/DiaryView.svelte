<script lang="ts">
  import { useDiscover } from "$lib/features/filters/useDiscover.ts";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { RecentlyWatchedType } from "$lib/sections/lists/stores/useRecentlyWatchedList.ts";
  import ModeSwitch from "../../browse/ModeSwitch.svelte";
  import PageHeading from "../PageHeading.svelte";
  import type { ProfileContext } from "../ProfileContext.ts";
  import DiaryList from "./DiaryList.svelte";

  const { context }: { context: ProfileContext } = $props();

  const { mode } = useDiscover();

  const historyType = $derived.by((): RecentlyWatchedType => {
    switch ($mode) {
      case "movie":
        return "movie";
      case "show":
        return "episode";
      default:
        return "media";
    }
  });
</script>

<PageHeading
  text={context.name ? m.boxed_profile_diary_title({ name: context.name }) : ""}
>
  {#snippet actions()}
    <ModeSwitch />
  {/snippet}
</PageHeading>

{#key historyType}
  <DiaryList slug={context.slug} type={historyType} isMe={context.isMe} />
{/key}

<p class="boxed-diary-note">{m.boxed_profile_diary_grouped_note()}</p>

<style>
  .boxed-diary-note {
    margin: 0;
    font-size: var(--ni-12);
    color: var(--color-text-secondary);
  }
</style>
