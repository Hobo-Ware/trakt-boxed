<script lang="ts">
  import { page } from "$app/state";
  import * as m from "$lib/features/i18n/messages.ts";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import type { ProfileContext } from "../ProfileContext.ts";
  import SubTabs from "../SubTabs.svelte";
  import { parseListsTab } from "../_internal/parseListsTab.ts";
  import ListsTab from "./ListsTab.svelte";

  const { context }: { context: ProfileContext } = $props();

  const active = $derived(
    parseListsTab({
      value: page.url.searchParams.get("tab"),
      isMe: context.isMe,
    }),
  );

  const tabs = $derived([
    { id: "personal", label: m.button_text_personal() },
    { id: "collaboration", label: m.list_title_collaborative_lists() },
    ...(context.isMe
      ? [
        { id: "liked", label: m.list_title_liked_lists() },
        {
          id: "smart",
          label: m.list_title_smart_lists(),
          href: UrlBuilder.lists.smart.all(),
        },
      ]
      : []),
  ]);
</script>

<SubTabs {tabs} {active} label={m.list_title_user_lists()} />

{#key active}
  <ListsTab slug={context.slug} type={active} />
{/key}
