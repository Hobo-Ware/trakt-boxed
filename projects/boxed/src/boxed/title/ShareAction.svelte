<script lang="ts">
  import { browser } from "$app/environment";
  import { page } from "$app/state";
  import { useShare } from "$lib/components/buttons/share/useShare.ts";
  import { useActionToast } from "$lib/features/action-toast/useActionToast.ts";
  import * as m from "$lib/features/i18n/messages.ts";
  import { copyToClipboard } from "$lib/utils/clipboard/copyToClipboard.ts";
  import { PREFETCH_SHARE_PARAM } from "$lib/utils/requests/shouldPrefetch.ts";
  import ActionRow from "./ActionRow.svelte";

  const { title, text }: { title: string; text: string } = $props();

  const { share } = useShare({ id: "summary" });
  const { notify } = useActionToast();

  const onShare = async () => {
    if (!browser) return;

    const url = new URL(page.url);
    url.search = "";
    url.searchParams.set(PREFETCH_SHARE_PARAM, "true");
    const data = { title, text, url: url.toString() };

    if (navigator.canShare?.(data)) {
      await share(data);
      return;
    }

    const copied = await copyToClipboard(data.url)
      .then(() => true)
      .catch(() => false);
    if (!copied) return;

    notify({ message: m.button_label_copied() });
  };
</script>

<ActionRow onclick={onShare}>{m.button_text_share()}</ActionRow>
