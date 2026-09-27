<script lang="ts">
  import StemLinkTag from "$lib/components/media/tags/StemLinkTag.svelte";
  import type { TagIntl } from "$lib/components/media/tags/TagIntl.ts";
  import { TagIntlProvider } from "$lib/components/media/tags/TagIntlProvider.ts";

  const {
    count = 0,
    i18n = TagIntlProvider,
  }: {
    variant?: "default" | "full";
    count?: number;
    i18n?: TagIntl;
  } = $props();
</script>

<StemLinkTag label={i18n.postCredits(count)} />
