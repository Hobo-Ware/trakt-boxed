<script lang="ts">
  import * as m from "$lib/features/i18n/messages.ts";
  import type { PersonalListType } from "$lib/sections/lists/user/models/PersonalListType.ts";
  import { usePersonalListsSummary } from "$lib/sections/lists/user/usePersonalListsSummary.ts";
  import { untrack } from "svelte";
  import ListCardGrid from "./ListCardGrid.svelte";

  const { type, slug = "me" }: { type: PersonalListType; slug?: string } =
    $props();

  const { list, isLoading } = usePersonalListsSummary(
    untrack(() => ({ type, slug, limit: 4 })),
  );
</script>

<ListCardGrid
  lists={$isLoading ? null : $list.slice(0, 4)}
  reserveItems={4}
  emptyText={m.text_placeholder_generic()}
/>
